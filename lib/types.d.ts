// Definiše tip za kolekciju
type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
}

// Definiše tip za proizvod
type ProductType = {
  _id: string;
  title: string;
  description: string;
  ingredients: string;
  media: [string];
  category: string;
  collections: [CollectionType];
  tags: [string];
  price: number;
  discount?: number; 
  discountedPrice?: number | null; 
  pieces: number;
  createdAt: Date;
  updatedAt: Date;
}

// Definiše tip za kolonu narudžbine
type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  discount?: number | null; 
  discountedPrice?: number | null; 
  totalAmount: number;
  createdAt: string;
}

// Definiše tip za stavku narudžbine
type OrderItemType = {
  product: ProductType;
  quantity: number;
  discount?: number | null; 
  discountedPrice?: number | null; 
  pieces: number;
}

// Definiše tip za kupca
type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
}