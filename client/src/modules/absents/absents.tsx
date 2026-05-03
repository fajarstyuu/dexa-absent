import type { AbsentCheckoutDtoResponse } from "./dto/absent-checkout";
import type { GetAllAbsentDto, GetAllAbsentDtoResponse } from "./dto/get-my-absents";
import type { IsAlreadyAbsentResponse } from "./dto/is-already-absent";
import type { GetUserAbsentDtoRequest, GetUserAbsentDtoResponse } from "./dto/user-absent";

export const getMyAbsents = async (params: GetAllAbsentDto): Promise<GetAllAbsentDtoResponse> => {
    const page = params.page ? params.page.toString() : "1";
    const limit = params.limit ? params.limit.toString() : "10";
    const sortBy = params.sortBy ? params.sortBy : "createdAt";
    const sortOrder = params.sortOrder ? params.sortOrder : "desc";
    const date = params.date ? params.date : "";

  const queryRecord: Record<string, string> = {
    page: page,
    limit: limit,
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  if (date) queryRecord.date = date;

  const query = new URLSearchParams(queryRecord);

  const res = await fetch(`/api/absents/me?${query}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch all absents");
  }
  const data = await res.json();
  return data as GetAllAbsentDtoResponse;
}

export const isAlreadyabsent = async (): Promise<boolean> => {
  const res = await fetch(`/api/absents/already`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch all absents");
  }
  const data: IsAlreadyAbsentResponse = await res.json();
  return data.data;
}

export const absent = async (picture: File): Promise<AbsentCheckoutDtoResponse> => {
  if (!picture) {
    throw new Error("Gambar tidak boleh kosong");
  }
  if (picture.size > 1024 * 1024 * 10) {
    throw new Error("Gambar tidak boleh lebih dari 10MB");
  }
  const formData = new FormData();
  formData.append("picture", picture);
  const res = await fetch(`/api/absents`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data: AbsentCheckoutDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}

export const absentCheckout = async (): Promise<AbsentCheckoutDtoResponse> => {
  const res = await fetch(`/api/absents/checkout`, {
    method: "PATCH",
    credentials: "include",
  });
  const data: AbsentCheckoutDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}

export const getAllAbsents = async (params: GetAllAbsentDto): Promise<GetAllAbsentDtoResponse> => {
  const page = params.page ? params.page.toString() : "1";
  const limit = params.limit ? params.limit.toString() : "10";
  const sortBy = params.sortBy ? params.sortBy : "createdAt";
  const sortOrder = params.sortOrder ? params.sortOrder : "desc";
  const date = params.date ? params.date : "";
  const search = params.search ? params.search : "";

  const queryRecord: Record<string, string> = {
    page: page,
    limit: limit,
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  if (date) queryRecord.date = date;
  if (search) queryRecord.search = search;

  const query = new URLSearchParams(queryRecord);

  const res = await fetch(`/api/absents?${query}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch all absents");
  }
  const data = await res.json();
  return data as GetAllAbsentDtoResponse;
}

export const getUserAbsents = async (userId: number, params: GetUserAbsentDtoRequest): Promise<GetUserAbsentDtoResponse> => {
  const page = params.page ? params.page.toString() : "1";
  const limit = params.limit ? params.limit.toString() : "10";
  const sortBy = params.sortBy ? params.sortBy : "createdAt";
  const sortOrder = params.sortOrder ? params.sortOrder : "desc";
  const date = params.date ? params.date : "";

  const queryRecord: Record<string, string> = {
    page: page,
    limit: limit,
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  if (date) queryRecord.date = date;

  const query = new URLSearchParams(queryRecord);

  const res = await fetch(`/api/absents/user/${userId}?${query}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: GetUserAbsentDtoResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data as GetUserAbsentDtoResponse;
}