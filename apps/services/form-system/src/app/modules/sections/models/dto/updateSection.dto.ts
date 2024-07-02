import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class UpdateSectionDto {
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiPropertyOptional({ type: LanguageType })
  waitingText?: LanguageType
}
