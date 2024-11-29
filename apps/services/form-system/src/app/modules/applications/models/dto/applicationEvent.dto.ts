import { ApiPropertyOptional } from '@nestjs/swagger'

export class ApplicationEventDto {
  @ApiPropertyOptional()
  created?: Date

  @ApiPropertyOptional()
  eventType?: string

  @ApiPropertyOptional()
  isFileEvent?: boolean
}
