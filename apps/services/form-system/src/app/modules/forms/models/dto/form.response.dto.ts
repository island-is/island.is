import { ApiPropertyOptional } from '@nestjs/swagger'
import { FieldTypeDto } from '../../../fields/models/dto/fieldType.dto'
import { ListTypeDto } from '../../../lists/models/dto/listType.dto'
import { CertificationDto } from '../../../certifications/models/dto/certification.dto'
import { FormDto } from './form.dto'

export class FormResponseDto {
  @ApiPropertyOptional({ type: FormDto })
  form?: FormDto

  @ApiPropertyOptional({ type: [FieldTypeDto] })
  fieldTypes?: FieldTypeDto[]

  @ApiPropertyOptional({ type: [CertificationDto] })
  certificationTypes?: CertificationDto[]

  @ApiPropertyOptional({ type: [ListTypeDto] })
  listTypes?: ListTypeDto[]

  @ApiPropertyOptional({ type: [FormDto] })
  forms?: FormDto[]
}
