export type GetAllRolesDtoRequest = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
}

export type GetAllRolesDtoResponse = {
  statusCode: number;
  message: string;
  data: GetAllRolesDtoData[];
  total: number;
}

export type GetAllRolesDtoData = {
  id: number;
  name: string;
}
