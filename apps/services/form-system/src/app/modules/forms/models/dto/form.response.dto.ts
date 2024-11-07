import { ApiPropertyOptional } from '@nestjs/swagger'
// import { FieldTypeDto } from '../../../fields/models/dto/fieldType.dto'
// import { ListTypeDto } from '../../../organizationListTypes/models/dto/listType.dto'
// import { FormCertificationDto } from '../../../formCertificationsTypes/models/dto/formCertification.dto'
import { FormDto } from './form.dto'
import { ApplicantType } from '../../../../dataTypes/applicantTypes/applicantType.model'
import { FieldType } from '../../../../dataTypes/fieldTypes/fieldType.model'
import { ListType } from '../../../../dataTypes/listTypes/listType.model'
import { CertificationType } from '../../../../dataTypes/certificationTypes/certificationType.model'

export class FormResponseDto {
  @ApiPropertyOptional({ type: FormDto })
  form?: FormDto

  @ApiPropertyOptional({ type: [FieldType] })
  fieldTypes?: FieldType[]

  @ApiPropertyOptional({ type: [CertificationType] })
  certificationTypes?: CertificationType[]

  @ApiPropertyOptional({ type: [ApplicantType] })
  applicantTypes?: ApplicantType[]

  @ApiPropertyOptional({ type: [ListType] })
  listTypes?: ListType[]

  @ApiPropertyOptional({ type: [FormDto] })
  forms?: FormDto[]
}
