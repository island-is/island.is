import { ApiProperty } from '@nestjs/swagger'

export class OrganizationCertificationTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  certificationTypeId!: string
}
