"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/collections/CollectionColumns";
import Loader from "@/components/custom ui/Loader";

//Prikaz svih kreiranih kolekcija ako ih ima
const Collections = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="p-4 md:p-12 bg-grey min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <p className="text-heading2-bold font-playfair text-gold-1 text-center md:text-left">Collections</p>
        <Button
          className="bg-gold font-montserrat text-white mt-4 md:mt-0"
          onClick={() => router.push("/collections/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Collection
        </Button>
      </div>
      <Separator className="bg-gold mt-4 mb-7" />
      <div>
        <DataTable columns={columns} data={collections} searchKey="title"/>
      </div>
    </div>
  );
};

export default Collections;
export const dynamic = "force-dynamic";
