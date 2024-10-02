import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

// CORS zaglavlja za omogućavanje pristupa iz drugih domena
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handler za OPTIONS zahtev (koristi se za CORS zahteve)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Handler za POST zahtev za kreiranje Stripe Checkout sesije
export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();  // Dohvatanje podataka iz zahteva

    if (!cartItems || !customer) { // Provera da li su prisutni svi potrebni podaci
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["RS", "HR", "BG", "GR", "RO", "BA", "AL", "ME", "MK"], // Dozvoljene su samo drzave sa Balkana
      },
      line_items: cartItems.map((cartItem: any) => {
        const itemPrice = cartItem.discount 
        ? cartItem.item.price * (1 - (cartItem.discount / 100)) // Izračunavanje cene sa popustom
        : cartItem.item.price;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: cartItem.item.title,
              metadata: {
                productId: cartItem.item._id,
                ...(cartItem.discount && { size: cartItem.discount  || "N/A" }),
                ...(cartItem.discountedPrice && { size: cartItem.discountedPrice  || "N/A" }),
                ...(cartItem.pieces && { pieces: cartItem.pieces  || "N/A" }),
              },
            },
            unit_amount: itemPrice * 100,  // Cena proizvoda u centima
          },
          quantity: cartItem.quantity,
        };
      }),
      client_reference_id: customer.clerkId, // ID klijenta (iz Clerk-a)
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`, // URL na koji se preusmerava nakon uspešne kupovine
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`, // URL na koji se preusmerava nakon otkazivanja
    });

    return NextResponse.json(session, { headers: corsHeaders });
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
