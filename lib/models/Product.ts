import mongoose from "mongoose";

// Definisanje šeme za proizvod
const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  media: [String],
  category: String,
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags: [String],
  ingredients: String,
  // Tip za cenu sa velikom preciznošću i funkcija za konverziju Decimal128 u broj
  price: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  pieces: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  discount: { type: Number, default: null },
  discountedPrice: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

// Ako model već postoji, koristi ga; inače kreiraj novi model
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;