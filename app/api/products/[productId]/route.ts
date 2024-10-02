import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Handler za GET zahtev za preuzimanje proizvoda na osnovu ID-a
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();

    // Pronalaženje proizvoda na osnovu ID-a i populisanje povezanih kolekcija
    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }
    // Vraćanje proizvoda u odgovoru sa CORS zaglavljem
    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[productId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// Handler za POST zahtev za ažuriranje proizvoda na osnovu ID-a
export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();  // Autentifikacija korisnika

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectToDB();

     // Pronalaženje proizvoda na osnovu ID-a
    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }
    // Preuzimanje podataka iz zahteva
    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      price,
      pieces,
      ingredients
    } = await req.json();

     // Proveravanje da li su svi potrebni podaci prisutni
    if (!title || !description || !media || !price) {
      return new NextResponse("Not enough data to create a new product", {
        status: 400,
      });
    }
    // Pronalaženje kolekcija koje su dodate ili uklonjene
    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );
    
    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );
   
    // Ažuriranje kolekcija
    await Promise.all([
      // Dodavanje proizvoda u nove kolekcije
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id },
        })
      ),

      // Uklanjanje proizvoda iz kolekcija iz kojih je uklonjen
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Ažuriranje proizvoda
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        category,
        collections,
        tags,
        price,
        pieces,
        ingredients

      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// Handler za DELETE zahtev za brisanje proizvoda na osnovu ID-a
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }
    // Brisanje proizvoda
    await Product.findByIdAndDelete(product._id);

    // Ažuriranje kolekcija kako bi se uklonili proizvodi
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";