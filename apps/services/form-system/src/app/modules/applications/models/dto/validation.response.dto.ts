import { ApiPropertyOptional } from '@nestjs/swagger'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'

export class ValidationResponseDto {
  @ApiPropertyOptional({ type: () => ScreenDto })
  screen?: ScreenDto

  @ApiPropertyOptional()
  validationFailed?: boolean
}
