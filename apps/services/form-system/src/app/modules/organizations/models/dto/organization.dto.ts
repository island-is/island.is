import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FormDto } from '../../../forms/models/dto/form.dto'

export class OrganizationDto {
  @ApiProperty()
  id?: string

  @ApiProperty({ type: String })
  nationalId!: string

  @ApiPropertyOptional({ type: [FormDto] })
  forms?: FormDto[]
}
