import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetAllAbsentDto {
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
  search: string = '';

  @IsOptional()
  @IsString()
  date?: string;
}

export class GetAllAbsentDtoResponse {
  statusCode!: number;
  message!: string;
  data!: GetAllAbsentDtoData[];
  total!: number;
}

export class GetAllAbsentDtoData {
  id!: number;
  name!: string;
  email!: string;
  role!: string;
  picturePath!: string | null;
  date!: string;
  checkIn!: string;
  checkOut!: string | null;
}
