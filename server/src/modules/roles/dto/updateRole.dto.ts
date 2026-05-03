import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDtoRequest {
  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateRoleDtoResponse {
  statusCode!: number;
  message!: string;
}
