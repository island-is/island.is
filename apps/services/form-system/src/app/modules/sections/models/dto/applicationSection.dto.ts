import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ApplicationScreenDto } from '../../../screens/models/dto/applicationScreen.dto'

export class ApplicationSectionDto {
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

  @ApiProperty({ type: [ApplicationScreenDto] })
  screens!: ApplicationScreenDto[]
}
