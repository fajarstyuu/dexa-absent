export type UpdateUserDtoRequest = {
  name?: string;
  email?: string;
  roleId?: number;
}

export type UpdateUserDtoResponse = {
  statusCode: number;
  message: string;
}
