import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

// Handler za GET zahtev za preuzimanje detalja narudžbine
export const GET = async (req: NextRequest, { params }: { params: { orderId: String }}) => {
  
  try {
    await connectToDB()
    // Pronalazak narudžbine po ID-u i populisanje podataka o proizvodima
    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: Product
    })

    if (!orderDetails) {  // Ako narudžbina nije pronađena, vraća se greška 404
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404 })
    }
      // Pronalazak korisnika na osnovu clerkId iz narudžbine
    const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId})

    return NextResponse.json({ orderDetails, customer }, { status: 200 })
  } catch (err) {
    console.log("[orderId_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";