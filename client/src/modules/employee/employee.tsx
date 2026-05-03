import { validateEmail, validateName } from "@/lib/helper";
import type { CreateUserDto, CreateUserDtoResponse } from "./dto/create-employee";
import type { GetAllUsersDtoRequest, GetAllUsersDtoResponse } from "./dto/get-all-employee";
import type { GetUserByIdDtoResponse } from "./dto/get-employee";
import type { UpdateUserDtoRequest, UpdateUserDtoResponse } from "./dto/update-employee";
import type { DeleteUserDtoResponse } from "./dto/delete-employee";

export const GetAllEmployee = async (query?: GetAllUsersDtoRequest): Promise<GetAllUsersDtoResponse> => {
  const page = query?.page ? query?.page.toString() : "1";
  const limit = query?.limit ? query?.limit.toString() : "10";
  const sortBy = query?.sortBy ? query?.sortBy : "createdAt";
  const sortOrder = query?.sortOrder ? query?.sortOrder : "desc";
  const search = query?.search ? query?.search : "";
  const queryRecord: Record<string, string> = {
    page: page,
    limit: limit,
    sortBy: sortBy,
    sortOrder: sortOrder,
    search: search
  };
  const queryString = new URLSearchParams(queryRecord).toString();
  const res = await fetch(`/api/users?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: GetAllUsersDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data
}

export const CreateEmployee = async (body: CreateUserDto): Promise<CreateUserDtoResponse> => {
  if (!body.name || !body.password || !body.roleId || !body.email) {
    throw new Error("Semua field harus diisi!");
  }
  if (!validateEmail(body.email)) {
    throw new Error("Email tidak valid!");
  }
  if (!validateName(body.name)) {
    throw new Error("Nama tidak valid!");
  }
  const res = await fetch(`/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data: CreateUserDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data
}

export const GetUserById = async (id: number): Promise<GetUserByIdDtoResponse> => {
  if (!id) {
    throw new Error("ID tidak boleh kosong");
  }
  const res = await fetch(`/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: GetUserByIdDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data
}

export const UpdateUserById = async (id: number, body: UpdateUserDtoRequest): Promise<UpdateUserDtoResponse> => {
  if (!id) {
    throw new Error("ID tidak boleh kosong");
  }
  if (!body.email || !body.name || !body.roleId) {
    throw new Error("Semua field harus diisi!");
  }
  if (!validateName(body.name)) {
    throw new Error("Nama tidak valid!");
  }
  if (!validateEmail(body.email)) {
    throw new Error("Email tidak valid!");
  }
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data: UpdateUserDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data
}

export const deleteEmployee = async (id: number): Promise<DeleteUserDtoResponse> => {
  if (!id) {
    throw new Error("ID karyawan harus diisi!");
  }
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data: DeleteUserDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}