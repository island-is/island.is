import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class UpdateScreenDto {
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  multiset!: number

  @ApiProperty()
  callRuleset!: boolean
}
