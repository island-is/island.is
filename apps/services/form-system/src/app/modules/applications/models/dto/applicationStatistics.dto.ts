import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class ApplicationStatisticsDto {
  @ApiProperty()
  @Expose()
  @IsString()
  formId!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
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
}
