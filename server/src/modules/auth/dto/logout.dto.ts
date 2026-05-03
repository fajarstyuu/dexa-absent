import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutRequestDto {
  @IsNotEmpty()
  @IsString()
  token!: string;
}

export class LogoutResponseDto {
  statusCode!: number;
  message!: string;
}
