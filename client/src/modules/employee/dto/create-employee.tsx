export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export type CreateUserDtoResponse = {
  statusCode: number;
  message: string;
}
