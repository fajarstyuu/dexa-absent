import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class CreateRoleDtoResponse {
  statusCode!: number;
  message!: string;
}
