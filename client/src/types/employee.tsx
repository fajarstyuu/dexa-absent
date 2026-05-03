import { DeleteModal } from "@/components/employee/delete-modals";
import { UpdateEmployeeDialog } from "@/components/employee/update-employee-dialog";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export type EmployeeRow = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export const columns: ColumnDef<EmployeeRow>[] = [
  {
    id: "number",
    header: "No.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "absent",
    header: "Lihat Absensi",
    cell: ({ row }) => (
      <Link to={`/absent/user/${row.original.id}`}>
        <Button variant="safe" size="icon">
          <Eye />
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "edit",
    header: "Edit",
    cell: ({row}) => <UpdateEmployeeDialog userId={row.original.id} />,
  },
  {
    accessorKey: "delete",
    header: "Hapus",
    cell: ({row}) => <DeleteModal employeeId={row.original.id} />,
  },
];

export const employees: EmployeeRow[] = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Developer" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Designer",
  },
];
