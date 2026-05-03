import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetAllUsersDtoRequest {
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
  @IsIn(['createdAt', 'name', 'email'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  search: string = '';
}

export class GetAllUsersDtoResponse {
  statusCode!: number;
  message!: string;
  data!: GetAllUsersDtoData[];
  total!: number;
}

export class GetAllUsersDtoData {
  id!: number;
  name!: string;
  email!: string;
  role!: string;
}
