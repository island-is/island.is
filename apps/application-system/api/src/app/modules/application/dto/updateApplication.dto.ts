import { IsObject, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object
}
