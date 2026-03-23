import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class ApplicationEventDto {
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  created?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  eventType?: string
}
