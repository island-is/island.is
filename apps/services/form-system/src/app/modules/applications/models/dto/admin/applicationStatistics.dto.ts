import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ApplicationStatisticsDto {
  @ApiProperty()
  @Expose()
  @IsString()
  formId!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  formName?: string

  @ApiProperty()
  @Expose()
  @IsNumber()
  totalCount!: number

  @ApiProperty()
  @Expose()
  @IsNumber()
  inProgressCount!: number

  @ApiProperty()
  @Expose()
  @IsNumber()
  completedCount!: number

  @ApiProperty()
  @Expose()
  institutionNationalId!: string

  @ApiPropertyOptional()
  @Expose()
  institutionName?: string

  @ApiPropertyOptional()
  @Expose()
  institutionContentfulSlug?: string
}
