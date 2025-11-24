import { ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationDto } from './application.dto'
import { Option } from '../../../../dataTypes/option.model'

export class ApplicationResponseDto {
  @ApiPropertyOptional({ type: [ApplicationDto] })
  applications?: ApplicationDto[]

  @ApiPropertyOptional()
  application?: ApplicationDto

  @ApiPropertyOptional()
  total?: number

  @ApiPropertyOptional({ type: [Option] })
  organizations?: Option[]

  @ApiPropertyOptional()
  isLoginTypeAllowed?: boolean
}
