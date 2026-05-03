import type { ColumnDef } from "@tanstack/react-table";

export type GetUserAbsentDtoResponse = {
  statusCode: number;
  message: string;
  data: GetUserAbsentDtoData[];
  total: number;
  name: string;
}

export type GetUserAbsentDtoData = {
  id: number;
  picturePath: string | null;
  date: string;
  checkIn: string;
  checkOut: string | null;
}

export const columns: ColumnDef<GetUserAbsentDtoData>[] = [
    { id: "number", header: "No.", cell: ({ row }) => row.index + 1 },
    { accessorKey: "picturePath", header: "Picture", 
      cell: ({ row }) => row.original.picturePath && <a href={row.original.picturePath} target="_blank" rel="noopener noreferrer">
            <img className="h-12 w-12 object-cover cursor-pointer hover:opacity-80 transition-opacity rounded-md" src={row.original.picturePath} alt="Bukti Absen" />
          </a>
    },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "checkIn", header: "Check In" },
    { accessorKey: "checkOut", header: "Check Out" },
];

export const absentData: GetUserAbsentDtoData[] = [
  {
    id: 1,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 2,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 3,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 4,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 5,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  }, {
    id: 1,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 2,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 3,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 4,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 5,
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
];