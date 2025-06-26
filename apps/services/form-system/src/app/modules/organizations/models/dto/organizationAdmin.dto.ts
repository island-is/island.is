import { ApiPropertyOptional } from '@nestjs/swagger'
import { CertificationType } from '../../../../dataTypes/certificationTypes/certificationType.model'
import { Option } from '../../../../dataTypes/option.model'
import { ListType } from '../../../../dataTypes/listTypes/listType.model'
import { FieldType } from '../../../../dataTypes/fieldTypes/fieldType.model'
import { OrganizationUrlDto } from '../../../organizationUrls/models/dto/organizationUrl.dto'

export class OrganizationAdminDto {
  @ApiPropertyOptional()
  organizationId!: string

  @ApiPropertyOptional()
  selectedListTypes: string[] = []

  @ApiPropertyOptional()
  selectedFieldTypes: string[] = []

  @ApiPropertyOptional()
  selectedCertificationTypes: string[] = []

  @ApiPropertyOptional({ type: [ListType] })
  ListTypes?: ListType[]

  @ApiPropertyOptional({ type: [FieldType] })
  FieldTypes?: FieldType[]

  @ApiPropertyOptional({ type: [CertificationType] })
  certificationTypes?: CertificationType[]

  @ApiPropertyOptional({ type: [OrganizationUrlDto] })
  submitUrls?: OrganizationUrlDto[]

  @ApiPropertyOptional({ type: [OrganizationUrlDto] })
  validationUrls?: OrganizationUrlDto[]

  @ApiPropertyOptional({ type: [Option] })
  organizations?: Option[]
}
