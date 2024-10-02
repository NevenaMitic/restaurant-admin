import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Handler za kreiranje novog proizvoda
export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth(); // Autentifikacija korisnika

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();
    // Parsiranje podataka iz zahteva
    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      price,
      discount,
      pieces,
      ingredients
    } = await req.json();

    // Provera obaveznih podataka
    if (!title || !media || !category || !price) { 
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }
     // Računanje cene sa popustom, ako postoji popust
     let discountedPrice = null;
     if (discount && discount > 0) {
       discountedPrice = price - (price * discount) / 100;
     }
 
     const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      tags,
      price,
      discount,
      discountedPrice,
      pieces,
      ingredients,
    });

    await newProduct.save();

    // Ažuriranje kolekcija dodavanjem novog proizvoda
    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// Handler za preuzimanje svih proizvoda
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    
    // Preuzimanje proizvoda i populacija kolekcija
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic"; // Obezbeđuje da su sve rute dinamične
