import { ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationDto } from './application.dto'
import { ApplicationMinimalDto } from './applicationMinimal.dto'

export class ApplicationListDto {
  @ApiPropertyOptional({ type: [ApplicationDto] })
  applications?: ApplicationMinimalDto[]

  @ApiPropertyOptional()
  total?: number
}
