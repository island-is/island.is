import { ApiProperty } from '@nestjs/swagger'
import { CertificationType } from '../../../../dataTypes/certificationTypes/certificationType.model'

export class OrganizationAdminDto {
  @ApiProperty()
  selectedCertificationTypes!: string[]

  @ApiProperty({ type: [CertificationType] })
  certificationTypes!: CertificationType[]
}
