import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDtoRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;
}

export class UpdateUserDtoResponse {
  statusCode!: number;
  message!: string;
}
