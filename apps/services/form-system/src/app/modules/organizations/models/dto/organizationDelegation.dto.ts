import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class OrganizationDelegationDto {
  @ApiProperty()
  @IsString()
  organizationNationalId!: string

  @ApiProperty()
  @IsString()
  delegation!: string
}
