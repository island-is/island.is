import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class ScreenErrorMessageDto {
  @ApiPropertyOptional({ type: LanguageType })
  title?: LanguageType

  @ApiPropertyOptional({ type: LanguageType })
  message?: LanguageType
}
