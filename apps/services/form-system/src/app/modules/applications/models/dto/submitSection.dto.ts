import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class SubmitSectionDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  applicationId?: string
}
