import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

export class ApplicationEventDto {
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  created?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  eventType?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isFileEvent?: boolean
}
