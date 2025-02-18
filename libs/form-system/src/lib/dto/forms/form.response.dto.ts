import { ApiPropertyOptional } from '@nestjs/swagger'
import { FormDto } from './form.dto'
import {
  ApplicantType,
  CertificationType,
  FieldType,
  ListType,
} from '@island.is/form-system-dataTypes'
import { OrganizationUrlDto } from '../organizationUrls/organizationUrl.dto'

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

  @ApiPropertyOptional({ type: [OrganizationUrlDto] })
  urls?: OrganizationUrlDto[]

  @ApiPropertyOptional({ type: [FormDto] })
  forms?: FormDto[]

  @ApiPropertyOptional({ type: [String] })
  organizationNationalIds?: string[]

  // @ApiPropertyOptional({ type: [OrganizationDto] })
  // organizations?: OrganizationDto[]
}
