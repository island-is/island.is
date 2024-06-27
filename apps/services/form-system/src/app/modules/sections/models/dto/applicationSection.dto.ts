import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ApplicationScreen } from '../../../screens/models/dto/applicationScreen.dto'

export class ApplicationSection {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  sectionType!: string

  @ApiProperty()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  waitingText?: LanguageType

  @ApiProperty()
  callRuleset!: boolean

  @ApiProperty({ type: [ApplicationScreen] })
  screens!: ApplicationScreen[]
}
