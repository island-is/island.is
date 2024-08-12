import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ApplicationScreenDto } from '../../../screens/models/dto/applicationScreen.dto'
import { SectionTypes } from '../../../../enums/sectionTypes'

export class ApplicationSectionDto {
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

  @ApiProperty({ type: [ApplicationScreenDto] })
  screens!: ApplicationScreenDto[]
}
