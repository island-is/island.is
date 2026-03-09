import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'

export class NotificationResponseDto {
  @ApiPropertyOptional({ type: () => ScreenDto })
  screen?: ScreenDto

  @ApiHideProperty()
  operationSuccessful?: boolean
}
