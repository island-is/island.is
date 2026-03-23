import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class ApplicationTypeDto {
  @ApiProperty()
  @Expose()
  @IsString()
  id!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  name?: string
}
