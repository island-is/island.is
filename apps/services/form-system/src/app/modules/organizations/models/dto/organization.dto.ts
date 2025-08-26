import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FormDto } from '../../../forms/models/dto/form.dto'

export class OrganizationDto {
  @ApiProperty()
  id?: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: String })
  nationalId!: string

  @ApiPropertyOptional({ type: [FormDto] })
  forms?: FormDto[]
}
