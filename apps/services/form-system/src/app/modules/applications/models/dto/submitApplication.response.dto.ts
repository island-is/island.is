import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ScreenErrorMessageDto } from './screenErrorMessage.dto'

export class SubmitApplicationResponseDto {
  @ApiProperty()
  success!: boolean

  @ApiPropertyOptional({ type: [ScreenErrorMessageDto] })
  screenErrorMessages?: ScreenErrorMessageDto[]
}
