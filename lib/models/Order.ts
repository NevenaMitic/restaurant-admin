import mongoose from "mongoose";

// Definisanje šeme za narudzbinu
const orderSchema = new mongoose.Schema({
  customerClerkId: String,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      media: String,
      pieces: Number,
      quantity: Number,
      discount: Number,
      discountedPrice: Number
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;