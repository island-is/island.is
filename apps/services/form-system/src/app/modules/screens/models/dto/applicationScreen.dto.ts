import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ApplicationFieldDto } from '../../../fields/models/dto/applicationField.dto'

export class ApplicationScreen {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sectionId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  displayOrder!: number

  @ApiProperty()
  multiset!: number

  @ApiProperty({ type: [ApplicationFieldDto] })
  fields!: ApplicationFieldDto[]
}
