import { ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationDto } from './application.dto'

export class ApplicationListDto {
  @ApiPropertyOptional({ type: [ApplicationDto] })
  applications?: ApplicationDto[]

  @ApiPropertyOptional()
  total?: number
}
