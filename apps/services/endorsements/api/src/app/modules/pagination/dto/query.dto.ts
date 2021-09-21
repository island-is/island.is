import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Max, Min } from 'sequelize-typescript';

export class QueryDto {
  @IsOptional()
  @IsNumber()
  // @Min(1)
  // @Max(50)
  @ApiProperty({required:false})
  limit?: number;

  @IsOptional()
  @ApiProperty({required:false})
  @IsString()
  before?: string;

  @IsOptional()
  @ApiProperty({required:false})
  @IsString()
  after?: string;

}