export type GetRoleByIdDtoResponse = {
  statusCode: number;
  message: string;
  data: GetRoleByIdDtoResponseData | null;
}

export type GetRoleByIdDtoResponseData = {
  id: number;
  name: string;
}
