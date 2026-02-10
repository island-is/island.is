import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class ApplicationTypeDto {
  @ApiProperty()
  @Expose()
  @IsString()
  id!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  name?: string
}
