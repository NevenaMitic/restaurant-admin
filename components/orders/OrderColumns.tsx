"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

// Definicija kolona za tabelu sa narudžbinama
export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: "Order",
    cell: ({ row }) => {
      return (
        <Link
          href={`/orders/${row.original._id}`} // Link na stranicu sa detaljima narudžbine
          className="hover:text-yellow-1"
        >
          {row.original._id}
        </Link>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "totalAmount",
    header: "Total (EUR)",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];