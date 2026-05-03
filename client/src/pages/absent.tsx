import { SortOrder } from "@/components/absent/sort-order";
import { DataTable } from "@/components/data-table";
import { DatePicker } from "@/components/datepicker";
import { Field } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { getAllAbsents } from "@/modules/absents/absents";
import type { GetAllAbsentDto } from "@/types/absent";
import { columns } from "@/types/absent";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export function AbsentPage() {
  const [data, setData] = useState<GetAllAbsentDto[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
  
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchValue, setSearchValue] = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [sortBy, setSortBy] = useState("createdAt");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchValue);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const fetchAbsents = async () => {
      setIsLoading(true);
      try {
        const res = await getAllAbsents({
          page,
          limit: 10,
          sortOrder,
          search: searchDebounced,
          sortBy: "createdAt",
          date: date ? format(date, "yyyy-MM-dd") : undefined,
        });
        setData(res.data || []);
        setTotal(res.total || 0);
      } catch (error) {
        console.error("Gagal mengambil data absen:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbsents();
  }, [page, sortBy, sortOrder, searchDebounced, date]);
  
  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col rounded-xl border border-dashed bg-background/60 text-center">
      <div className="flex flex-col-reverse gap-y-4 gap-x-4 lg:flex-row items-end justify-end w-full overflow-x-auto p-4">
        <SortOrder value={sortOrder} onValueChange={(value) => { setSortOrder(value); setPage(1); }} />
        <DatePicker value={date} onValueChange={(value) => { setDate(value); setPage(1); }} />
        <Field className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
      </div>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
      <DataTable 
        columns={columns} 
        data={data} 
        pageCount={Math.ceil(total / 10)} 
        pageIndex={page - 1} 
        setPageIndex={(index) => setPage(index + 1)} 
      />)}
    </div>
  );
}

export default AbsentPage;
