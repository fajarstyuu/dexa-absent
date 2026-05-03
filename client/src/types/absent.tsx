import type { ColumnDef } from "@tanstack/react-table";

export type GetAllAbsentDto = {
    id: number;
    name: string;
    email: string;
    role: string;
    picturePath: string | null;
    date: string;
    checkIn: string;
    checkOut: string | null;
}

export const columns: ColumnDef<GetAllAbsentDto>[] = [
    { id: "number", header: "No.", cell: ({ row }) => row.index + 1 },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "picturePath", header: "Picture", 
      cell: ({ row }) => row.original.picturePath && <a href={row.original.picturePath} target="_blank" rel="noopener noreferrer">
            <img className="h-12 w-12 object-cover cursor-pointer hover:opacity-80 transition-opacity rounded-md" src={row.original.picturePath} alt="Bukti Absen" />
          </a>
    },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "checkIn", header: "Check In" },
    { accessorKey: "checkOut", header: "Check Out" },
];

export const absentData: GetAllAbsentDto[] = [
  {
    id: 1,
    name: "John Doe",
    email: "[EMAIL_ADDRESS]",
    role: "Software Engineer",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "[EMAIL_ADDRESS]",
    role: "Product Manager",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "[EMAIL_ADDRESS]",
    role: "Data Analyst",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "[EMAIL_ADDRESS]",
    role: "UX Designer",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 5,
    name: "Mike Brown",
    email: "[EMAIL_ADDRESS]",
    role: "DevOps Engineer",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  }, {
    id: 1,
    name: "John Doe",
    email: "[EMAIL_ADDRESS]",
    role: "Software Engineer",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "[EMAIL_ADDRESS]",
    role: "Product Manager",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "[EMAIL_ADDRESS]",
    role: "Data Analyst",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "[EMAIL_ADDRESS]",
    role: "UX Designer",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 5,
    name: "Mike Brown",
    email: "[EMAIL_ADDRESS]",
    role: "DevOps Engineer",
    picturePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    date: "2022-01-01",
    checkIn: "09:00",
    checkOut: "18:00",
  },
];
