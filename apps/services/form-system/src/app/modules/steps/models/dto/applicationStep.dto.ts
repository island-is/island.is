import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ApplicationGroup } from '../../../groups/models/dto/applicationGroup.dto'

export class ApplicationStep {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  stepType!: string

  @ApiProperty()
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  waitingText?: LanguageType

  @ApiProperty()
  callRuleset!: boolean

  @ApiProperty({ type: [ApplicationGroup] })
  groups!: ApplicationGroup[]
}
