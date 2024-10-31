import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldDto } from '../../../fields/models/dto/field.dto'

export class ScreenDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sectionId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  displayOrder!: number

  @ApiProperty()
  isHidden!: boolean

  @ApiProperty()
  isCompleted!: boolean

  @ApiProperty()
  multiset!: number

  @ApiProperty()
  callRuleset!: boolean

  @ApiPropertyOptional({ type: [FieldDto] })
  fields?: FieldDto[]
}
