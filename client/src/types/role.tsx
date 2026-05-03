import { UpdateRoleDialog } from "@/components/role/update-role-dialog";
import { DeleteModalRole } from "@/components/role/delete-modals";
import type { ColumnDef } from "@tanstack/react-table";

export type GetAllRolesDto = {

  id: number;
  name: string;

}

export const columns: ColumnDef<GetAllRolesDto>[] = [
    { id: "number", header: "No.", cell: ({ row }) => row.index + 1 },
    { accessorKey: "name", header: "Name" },
    {
        accessorKey: "edit",
        header: "Edit",
        cell: ({ row }) => <UpdateRoleDialog roleId={row.original.id} />,
      },
      {
        accessorKey: "delete",
        header: "Hapus",
        cell: ({ row }) => <DeleteModalRole roleId={row.original.id} />,
      },
];

export const rolesData: GetAllRolesDto[] = [
  {
    id: 1,
    name: "HR",
  },
  {
    id: 2,
    name: "IT",
  },
  {
    id: 3,
    name: "Finance",
  },
];
