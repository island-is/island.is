import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CertificationType } from '../../../../dataTypes/certificationTypes/certificationType.model'
import { Option } from '../../../../dataTypes/option.model'

export class OrganizationAdminDto {
  @ApiPropertyOptional()
  organizationId!: string

  @ApiPropertyOptional()
  selectedCertificationTypes?: string[]

  @ApiPropertyOptional({ type: [CertificationType] })
  certificationTypes!: CertificationType[]

  @ApiPropertyOptional({ type: [Option] })
  organizations?: Option[]
}
