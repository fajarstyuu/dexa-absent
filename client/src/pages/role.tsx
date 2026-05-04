import { DataTable } from "@/components/data-table";
import { SortBy } from "@/components/role/sort-by";
import { SortOrder } from "@/components/role/sort-order";
import { AddRoleDialog } from "@/components/role/add-role-dialog";
import { Field } from "@/components/ui/field";
import { columns, type GetAllRolesDto } from "@/types/role";
import { useEffect, useState } from "react";
import { getAllRoles } from "@/modules/role/role";
import { Spinner } from "@/components/ui/spinner";

export function RolePage() {
  const [data, setData] = useState<GetAllRolesDto[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchValue, setSearchValue] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchValue);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const res = await getAllRoles({
          page,
          limit: 10,
          sortBy,
          sortOrder,
          search: searchDebounced,
        });
        setData(res.data as unknown as GetAllRolesDto[]);
        setTotal(res.total || 0);
      } catch (error) {
        console.error("Gagal mengambil data role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [page, sortBy, sortOrder, searchDebounced]);
  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col rounded-xl border border-dashed bg-background/60 text-center">
      <div className="flex flex-col-reverse gap-y-4 gap-x-4 lg:flex-row items-end justify-end w-full overflow-x-auto p-4">
        <SortOrder
          value={sortOrder}
          onValueChange={(v) => {
            setSortOrder(v);
            setPage(1);
          }}
        />
        <SortBy
          value={sortBy}
          onValueChange={(v) => {
            setSortBy(v);
            setPage(1);
          }}
        />
        <Field className="w-full max-w-md">
          <input
            type="text"
            placeholder="Cari role..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
        <AddRoleDialog />
      </div>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">
            Tidak ada data role yang ditemukan.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pageCount={Math.ceil(total / 10)}
          pageIndex={page - 1}
          setPageIndex={(index) => setPage(index + 1)}
        />
      )}
    </div>
  );
}

export default RolePage;
