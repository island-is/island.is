import { IsObject, IsString, IsOptional, IsArray } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object
}
