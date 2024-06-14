import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class GroupDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  stepId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: Date })
  created!: Date

  @ApiProperty({ type: Date })
  modified!: Date

  @ApiProperty()
  displayOrder!: number

  @ApiProperty()
  isHidden!: boolean

  @ApiProperty()
  multiset!: number
}
