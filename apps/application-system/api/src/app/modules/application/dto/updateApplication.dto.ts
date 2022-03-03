import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsObject, IsOptional } from 'class-validator'

export class UpdateApplicationDto {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object
}
