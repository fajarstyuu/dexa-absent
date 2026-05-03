export type GetUserAbsentDtoRequest = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  date?: string;
}

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
