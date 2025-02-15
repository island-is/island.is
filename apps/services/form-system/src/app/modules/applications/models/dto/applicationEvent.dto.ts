import { ApiPropertyOptional } from '@nestjs/swagger'

export class ApplicationEventDto {
  @ApiPropertyOptional({ type: Date })
  created?: Date

  @ApiPropertyOptional()
  eventType?: string

  @ApiPropertyOptional()
  isFileEvent?: boolean
}
