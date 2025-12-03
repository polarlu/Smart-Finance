"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {/* Container com Scroll Horizontal */}
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnMeta = header.column.columnDef.meta as
                    | { hideOnMobile?: boolean }
                    | undefined;
                  const hideOnMobile = columnMeta?.hideOnMobile ?? false;

                  return (
                    <TableHead
                      key={header.id}
                      className={`whitespace-nowrap px-2 py-2 text-[10px] font-semibold sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:text-sm ${
                        hideOnMobile ? "hidden lg:table-cell" : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnMeta = cell.column.columnDef.meta as
                      | { hideOnMobile?: boolean }
                      | undefined;
                    const hideOnMobile = columnMeta?.hideOnMobile ?? false;

                    return (
                      <TableCell
                        key={cell.id}
                        className={`whitespace-nowrap px-2 py-2 text-[10px] sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:text-sm ${
                          hideOnMobile ? "hidden lg:table-cell" : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-muted-foreground sm:h-32 sm:text-sm"
                >
                  <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                    <p className="text-sm font-medium sm:text-base">
                      Nenhuma transação encontrada
                    </p>
                    <p className="text-[10px] sm:text-xs">
                      Adicione uma nova transação para começar
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
