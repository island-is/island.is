import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ApplicationInput } from '../../../inputs/models/dto/applicationInput.dto'

export class ApplicationGroup {
  @ApiProperty()
  id!: string

  @ApiProperty()
  stepId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  displayOrder!: number

  @ApiProperty()
  multiset!: number

  @ApiProperty({ type: [ApplicationInput] })
  inputs!: ApplicationInput[]
}
