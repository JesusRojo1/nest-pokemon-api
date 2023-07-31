import { IsNumber, IsOptional, IsPositive, Min } from '@nestjs/class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  limit?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  offset?: number;
}
