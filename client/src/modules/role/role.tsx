import { validateName } from "@/lib/helper";
import type { CreateRoleDtoResponse } from "./dto/create-role";
import { type GetAllRolesDtoRequest, type GetAllRolesDtoResponse } from "./dto/get-all-role";
import type { DeleteRoleDtoResponse } from "./dto/delete-role";
import type { GetRoleByIdDtoResponse } from "./dto/get-role";
import type { UpdateRoleDtoRequest, UpdateRoleDtoResponse } from "./dto/update-role";

export const getAllRoles = async (query?: GetAllRolesDtoRequest): Promise<GetAllRolesDtoResponse> => {
  const page = query?.page ? query?.page.toString() : "1";
  const limit = query?.limit ? query?.limit.toString() : "10";
  const sortBy = query?.sortBy ? query?.sortBy : "name";
  const sortOrder = query?.sortOrder ? query?.sortOrder : "asc";
  const search = query?.search ? query?.search : "";
  const queryRecord: Record<string, string> = {
    page: page,
    limit: limit,
    sortBy: sortBy,
    sortOrder: sortOrder,
    search: search
  };

  const queryString = new URLSearchParams(queryRecord).toString();
  const res = await fetch(`/api/roles?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

export const createRole = async (name: string): Promise<CreateRoleDtoResponse> => {
  if (!name) {
    throw new Error("Nama role harus diisi!");
  }
  if (!validateName(name)) {
    throw new Error("Nama role tidak valid!");
  }
  const res = await fetch(`/api/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name.trim() }),
    credentials: "include",
  });
  const data: CreateRoleDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data
}

export const deleteRole = async (id: number): Promise<DeleteRoleDtoResponse> => {
  if (!id) {
    throw new Error("ID role harus diisi!");
  }
  const res = await fetch(`/api/roles/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data: DeleteRoleDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data
}

export const getRoleById = async (id: number): Promise<GetRoleByIdDtoResponse> => {
  if (!id) {
    throw new Error("ID tidak boleh kosong");
  }
  const res = await fetch(`/api/roles/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data: GetRoleByIdDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}

export const updateRoleById = async (id: number, body: UpdateRoleDtoRequest): Promise<UpdateRoleDtoResponse> => {
  if (!id) {
    throw new Error("ID tidak boleh kosong");
  }
  if (!body.name) {
    throw new Error("Nama role harus diisi!");
  }
  if (!validateName(body.name)) {
    throw new Error("Nama role tidak valid!");
  }
  const res = await fetch(`/api/roles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: body.name.trim() }),
    credentials: "include",
  });
  const data: UpdateRoleDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}