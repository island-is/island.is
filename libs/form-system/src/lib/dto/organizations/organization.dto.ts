import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FormDto } from '../forms/form.dto'

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
