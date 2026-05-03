export class GetUserByIdDtoResponse {
  statusCode!: number;
  message!: string;
  data!: GetUserByIdDtoResponseData | null;
}

export class GetUserByIdDtoResponseData {
  id!: number;
  name!: string;
  email!: string;
  roleId!: number;
}
