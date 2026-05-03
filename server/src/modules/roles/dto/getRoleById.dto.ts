export class GetRoleByIdDtoResponse {
  statusCode!: number;
  message!: string;
  data!: GetRoleByIdDtoResponseData | null;
}

export class GetRoleByIdDtoResponseData {
  id!: number;
  name!: string;
}
