import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateOrganizationPermissionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationNationalId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  permission!: string
}
