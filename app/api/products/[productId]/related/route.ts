import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

// Handler za GET zahtev za preuzimanje srodnih proizvoda na osnovu ID-a proizvoda
export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
  try {
    await connectToDB()

    const product = await Product.findById(params.productId) // Pronalaženje proizvoda na osnovu ID-a

    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 })
    }

    // Pronalaženje proizvoda koji su u istoj kategoriji ili kolekciji kao i trenutni proizvod, osim trenutnog proizvoda
    const relatedProducts = await Product.find({
      $or: [
        { category: product.category },
        { collections: { $in: product.collections }}
      ],
      _id: { $ne: product._id } // Izuzimanje trenutnog proizvoda
    })

    if (!relatedProducts) { 
      return new NextResponse(JSON.stringify({ message: "No related products found" }), { status: 404 })
    }

    return NextResponse.json(relatedProducts, { status: 200 })
  } catch (err) {
    console.log("[related_GET", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";