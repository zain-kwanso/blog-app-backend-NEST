import { IsInt, Min, Max, IsOptional, IsIn, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page number must be an integer' })
  @Min(1, { message: 'Page number must be at least 1' })
  @Max(100, { message: 'Page number cannot exceed 100' })
  page: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number;

  @IsOptional()
  @IsString()
  search?: string;
}
