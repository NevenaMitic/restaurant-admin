"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

// Definicija kolona za tabelu sa stavkama narudžbine
export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      return (
        <Link
          href={`/products/${row.original.product._id}`} // Link na stranicu proizvoda sa odgovarajucim id-em
          className="hover:text-yellow-1 text-black"
        >
          {row.original.product.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "pieces",
    header: "Piece",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];