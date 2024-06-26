import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class UpdateStepDto {
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  waitingText?: LanguageType

  @ApiProperty()
  callRuleset!: boolean
}
