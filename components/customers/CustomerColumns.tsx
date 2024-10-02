"use client";

import { ColumnDef } from "@tanstack/react-table";

// Definicija kolona za tabelu sa podacima o kupcima
export const columns: ColumnDef<CustomerType>[] = [
  {
    accessorKey: "clerkId",
    header: "Clerk ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
