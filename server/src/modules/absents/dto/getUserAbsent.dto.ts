import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetUserAbsentDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsIn(['createdAt'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  date?: string;
}

export class GetUserAbsentDtoResponse {
  statusCode!: number;
  message!: string;
  data!: GetUserAbsentDtoData[];
  total!: number;
  name!: string;
}

export class GetUserAbsentDtoData {
  id!: number;
  picturePath!: string | null;
  date!: string;
  checkIn!: string;
  checkOut!: string | null;
}
