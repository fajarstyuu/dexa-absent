export type GetUserByIdDtoResponse = {
  statusCode: number;
  message: string;
  data: GetUserByIdDtoResponseData | null;
}

export type GetUserByIdDtoResponseData = {
  id: number;
  name: string;
  email: string;
  roleId: number;
}
