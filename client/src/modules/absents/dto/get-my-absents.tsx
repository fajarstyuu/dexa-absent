export type GetAllAbsentDtoData = {
  id: number;
  name: string;
  email: string;
  role: string;
  picturePath: string | null;
  date: string;
  checkIn: string;
  checkOut: string | null;
}

export type GetAllAbsentDtoResponse = {
  statusCode: number;
  message: string;
  data: GetAllAbsentDtoData[];
  total: number;
}

export type GetAllAbsentDto = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  date?: string;
  search?: string;
}