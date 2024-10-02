import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

// Handler za GET zahtev za preuzimanje narudžbina na osnovu ID-a korisnika
export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    await connectToDB();

    // Pronalazak svih narudžbina za datog korisnika i populisanje podataka o proizvodima
    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "products.product", model: Product });
    

    // Vraćanje pronađenih narudžbina u odgovoru
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    // Logovanje greške i vraćanje odgovora o grešci
    console.log("[customerId_GET", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";