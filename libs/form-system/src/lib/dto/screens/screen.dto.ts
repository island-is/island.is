import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FieldDto } from '../fields/field.dto'

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
