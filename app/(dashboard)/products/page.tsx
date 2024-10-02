"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/products/ProductColumns";

// Komponenta Products za prikaz liste proizvoda
const Products = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  // Funkcija za dobijanje liste proizvoda iz API-ja
  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
      });
      const data = await res.json();
      console.log(data);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.log("[products_GET]", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="p-4 md:p-12 bg-grey h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <p className="text-heading2-bold font-playfair text-gold-1 text-center md:text-left">Products</p>
        
        {/* Dugme za kreiranje novog proizvoda */}
        <Button
          className="bg-gold text-white font-montserrat mt-4 md:mt-0"
          onClick={() => router.push("/products/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>
      <Separator className="bg-gold mt-4 mb-7" />
      <DataTable columns={columns} data={products} searchKey="title" />
    </div>
  );
};

export default Products;
export const dynamic = "force-dynamic";