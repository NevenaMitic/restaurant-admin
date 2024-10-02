"use client";
import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

// Definicija kolona za tabelu sa proizvodima
export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original._id}`}
        className="hover:text-yellow-300"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "collections",
    header: "Collections",
    // Prikaz kolekcija kao niz, odvojenih zarezom
    cell: ({ row }) => row.original.collections.map((collection) => collection.title).join(", "), 
  },
  {
    accessorKey: "price",
    header: "Price (EUR)",
  },
  {
    accessorKey: "discount",
    header: "Discount %",
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="product" id={row.original._id} />,
  },
];