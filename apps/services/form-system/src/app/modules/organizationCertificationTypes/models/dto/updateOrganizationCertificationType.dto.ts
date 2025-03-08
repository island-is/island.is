import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateOrganizationCertificationTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  certificationTypeId!: string
}
