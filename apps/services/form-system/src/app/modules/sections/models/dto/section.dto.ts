import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { SectionTypes } from '../../../../enums/sectionTypes'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'

export class SectionDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ enum: SectionTypes })
  sectionType!: string

  @ApiProperty()
  displayOrder!: number

  @ApiPropertyOptional({ type: LanguageType })
  waitingText?: LanguageType

  @ApiProperty()
  isHidden!: boolean

  @ApiProperty()
  isCompleted!: boolean

  @ApiPropertyOptional({ type: [ScreenDto] })
  screens?: ScreenDto[]
}
