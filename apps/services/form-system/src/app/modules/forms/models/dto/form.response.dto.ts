import { ApiPropertyOptional } from '@nestjs/swagger'
// import { FieldTypeDto } from '../../../fields/models/dto/fieldType.dto'
import { ListTypeDto } from '../../../lists/models/dto/listType.dto'
import { FormCertificationDto } from '../../../formCertifications/models/dto/formCertification.dto'
import { FormDto } from './form.dto'
import { ApplicantType } from '../../../../dataTypes/applicantType.model'
import { FieldType } from '../../../../dataTypes/fieldType.model'

export class FormResponseDto {
  @ApiPropertyOptional({ type: FormDto })
  form?: FormDto

  @ApiPropertyOptional({ type: [FieldType] })
  fieldTypes?: FieldType[]

  @ApiPropertyOptional({ type: [FormCertificationDto] })
  certificationTypes?: FormCertificationDto[]

  @ApiPropertyOptional({ type: [ApplicantType] })
  applicantTypes?: ApplicantType[]

  @ApiPropertyOptional({ type: [ListTypeDto] })
  listTypes?: ListTypeDto[]

  @ApiPropertyOptional({ type: [FormDto] })
  forms?: FormDto[]
}
