import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";

// Handler za Stripe webhook za kreiranje narudžbina
export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    // Verifikacija webhook događaja pomoću Stripe biblioteke
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Obrada događaja kada je checkout sesija završena
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      // Informacije o kupcu
      const customerInfo = {
        clerkId: session?.client_reference_id,
        name: session?.customer_details?.name,
        email: session?.customer_details?.email,
      };

      // Adresa za dostavu
      const shippingAddress = {
        street: session?.shipping_details?.address?.line1,
        city: session?.shipping_details?.address?.city,
        postalCode: session?.shipping_details?.address?.postal_code,
        country: session?.shipping_details?.address?.country,
      };

      // Dohvatanje detalja sesije iz Stripe-a
      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"] }
      );

      // Prikupljanje stavki iz sesije
      const lineItems = await retrieveSession?.line_items?.data;

      // Formiranje stavki narudžbine
      const orderItems = lineItems?.map((item: any) => {
        const unitAmount = item.price.unit_amount / 100; // Cena u evrima
        const discount = item.price.product.metadata.discount ? Number(item.price.product.metadata.discount) : 0; // Proverava da li postoji popust
        const finalPrice = discount ? unitAmount * (1 - discount / 100) : unitAmount; // Izračunavanje cene sa popustom

        return {
          product: item.price.product.metadata.productId,
          pieces: item.price.product.metadata.pieces || "N/A",
          discount: item.price.product.metadata.discount || "",
          quantity: item.quantity,
          finalPrice: finalPrice, // Dodaj finalPrice u stavku narudžbine
        };
      }) || []; // Ako su lineItems undefined, postavi orderItems na prazan niz

      await connectToDB();

      // Računanje ukupnog iznosa
      const totalAmount = orderItems.reduce((sum, item) => {
        return sum + (item.finalPrice * item.quantity);
      }, 0);

      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId,
        products: orderItems,
        shippingAddress,
        totalAmount,
      });

      await newOrder.save();

      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

      if (customer) {
        customer.orders.push(newOrder._id);
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        });
      }

      await customer.save();
    }

    return new NextResponse("Order created", { status: 200 });
  } catch (err) {
    console.log("[webhooks_POST]", err);
    return new NextResponse("Failed to create the order", { status: 500 });
  }
};
export const dynamic = "force-dynamic";