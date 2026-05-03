"use client";

import {
  type ColumnDef,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pageIndex?: number;
  setPageIndex?: (index: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  setPageIndex,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    ...(pageCount !== undefined && { pageCount, manualPagination: true }),
    ...(pageIndex !== undefined && {
      state: {
        pagination: {
          pageIndex,
          pageSize: 10,
        },
      },
    }),
    onPaginationChange: (updater) => {
      if (setPageIndex) {
        if (typeof updater === "function") {
          const newState = updater({
            pageIndex: pageIndex ?? 0,
            pageSize: 10,
          });
          setPageIndex(newState.pageIndex);
        } else {
          setPageIndex(updater.pageIndex);
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pageIndex === undefined ? getPaginationRowModel() : undefined,
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody className="text-left">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
              }}
              className={
                !table.getCanPreviousPage()
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
          {(() => {
            const currentPage = table.getState().pagination.pageIndex + 1;
            const pageCount = table.getPageCount();
            const maxButtons = 4;
            let startPage = Math.max(
              1,
              currentPage - Math.floor(maxButtons / 2),
            );
            let endPage = Math.min(pageCount, startPage + maxButtons - 1);

            if (endPage - startPage + 1 < maxButtons) {
              startPage = Math.max(1, endPage - maxButtons + 1);
            }

            const pages = Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i,
            );

            return (
              <>
                {startPage > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(0);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {startPage > 2 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}
                  </>
                )}
                {pages.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(page - 1);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {endPage < pageCount && (
                  <>
                    {endPage < pageCount - 1 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(pageCount - 1);
                        }}
                      >
                        {pageCount}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </>
            );
          })()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
              }}
              className={
                !table.getCanNextPage() ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
