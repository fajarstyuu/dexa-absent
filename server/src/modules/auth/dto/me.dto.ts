export class MeResponseDto {
  statusCode!: number;
  message!: string;
  data!: {
    id: number;
    email: string;
    name: string;
    roleId: number;
  };
}
