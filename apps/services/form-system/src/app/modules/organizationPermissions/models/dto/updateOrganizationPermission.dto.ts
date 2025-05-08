import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateOrganizationPermissionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  permission!: string
}
