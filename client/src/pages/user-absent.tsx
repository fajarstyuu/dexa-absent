import { SortOrder } from "@/components/absent/sort-order";
import { DataTable } from "@/components/data-table";
import { DatePicker } from "@/components/datepicker";
import { useAuthUser } from "@/guards/auth-guard";
import type { GetUserAbsentDtoData } from "@/types/user-absent";
import { columns } from "@/types/user-absent";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getUserAbsents } from "@/modules/absents/absents";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";

export function UserAbsentPage() {
  const { userId } = useParams<{ userId: string }>();
  const parsedUserId = Number(userId);

  const user = useAuthUser();
  const [data, setData] = useState<GetUserAbsentDtoData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    const fetchAbsents = async () => {
      setIsLoading(true);
      try {
        const res = await getUserAbsents(parsedUserId, {
          page,
          limit: 10,
          sortOrder,

          sortBy,
          date: date ? format(date, "yyyy-MM-dd") : undefined,
        });
        setData(res.data as unknown as GetUserAbsentDtoData[]);
        setTotal(res.total || 0);
      } catch (error) {
        console.error("Gagal mengambil data absen:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbsents();
  }, [page, sortBy, sortOrder, date]);
  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col rounded-xl border border-dashed bg-background/60 text-center">
      <div className="flex flex-col gap-y-4 gap-x-4 lg:flex-row items-end justify-end w-full overflow-x-auto p-4">
        <div className="flex w-full justify-end lg:justify-start">
          <p className="text-right lg:text-left px-2 text-2xl lg:text-4xl">{user?.name}</p>
        </div>
        <SortOrder value={sortOrder} onValueChange={(value) => { setSortOrder(value); setPage(1); }} />
        <DatePicker value={date} onValueChange={(value) => { setDate(value); setPage(1); }} />
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

export default UserAbsentPage;
