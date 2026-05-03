export type GetAllUsersDtoRequest = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
}

export type GetAllUsersDtoResponse = {
  statusCode: number;
  message: string;
  data: GetAllUsersDtoData[];
  total: number;
}

export type GetAllUsersDtoData = {
  id: number;
  name: string;
  email: string;
  role: string;
}
