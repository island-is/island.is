import { ApiPropertyOptional } from '@nestjs/swagger'
import { FormDto } from './form.dto'
import { ApplicantType } from '../../../../dataTypes/applicantTypes/applicantType.model'
import { FieldType } from '../../../../dataTypes/fieldTypes/fieldType.model'
import { ListType } from '../../../../dataTypes/listTypes/listType.model'
import { CertificationType } from '../../../../dataTypes/certificationTypes/certificationType.model'
import { Option } from '../../../../dataTypes/option.model'

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

  @ApiPropertyOptional({ type: [String] })
  submissionUrls?: string[]

  @ApiPropertyOptional({ type: [FormDto] })
  forms?: FormDto[]

  @ApiPropertyOptional({ type: [String] })
  organizationNationalIds?: string[]

  @ApiPropertyOptional({ type: [Option] })
  organizations?: Option[]
}
