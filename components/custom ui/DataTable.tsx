"use client";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "../ui/input";

// Definisanje interfejsa za DataTable komponentu
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Definicija kolona
  data: TData[]; // Podaci za tabelu
  pageSize?: number; // Veličina stranice
  searchKey: string; // Ključ za pretragu
}

// DataTable komponenta
export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pageSize = 5, 
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize, 
  });

  // Inicijalizacija tabele sa potrebnim opcijama
  const table = useReactTable({
    data, // Podaci za tabelu
    columns, // Kolone tabele
    getCoreRowModel: getCoreRowModel(), // Model za osnovne redove
    getPaginationRowModel: getPaginationRowModel(), // Model za paginaciju
    onColumnFiltersChange: setColumnFilters, // Promena filtera
    getFilteredRowModel: getFilteredRowModel(), // Model za filtrirane redove
    state: {
      columnFilters, // Trenutni filtri kolona
      pagination, // Trenutna paginacija
    },
    onPaginationChange: setPagination, // Promena paginacije
  });

  return (
    <div className="mx-5 py-5">
      {/* Input za pretragu */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-grey text-gold"
        />
      </div>

      {/* Tabela */}
      <div className="rounded-md border font-montserrat text-gold-1 overflow-x-auto">
        <Table>
          <TableHeader>
            {/* Zaglavlja tabele */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Redovi tabele */}
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Kontrola za paginaciju */}
      <div className="flex items-center justify-end text-gold-1 space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.previousPage(); // Prelazak na prethodnu stranicu
          }}
          disabled={!table.getCanPreviousPage()} // Onemogućeno ako nema prethodne stranice
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.nextPage(); // Prelazak na sledeću stranicu
          }}
          disabled={!table.getCanNextPage()} // Onemogućeno ako nema sledeće stranice
        >
          Next
        </Button>
      </div>

      {/* Trenutna paginacija */}
      <div className="text-gold-1 font-extralight">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
    </div>
  );
}
