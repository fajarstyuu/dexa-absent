import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetAllRolesDtoRequest {
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
  @IsIn(['createdAt', 'name'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  search: string = '';
}

export class GetAllRolesDtoResponse {
  statusCode!: number;
  message!: string;
  data!: GetAllRolesDtoData[];
  total!: number;
}

export class GetAllRolesDtoData {
  id!: number;
  name!: string;
}
