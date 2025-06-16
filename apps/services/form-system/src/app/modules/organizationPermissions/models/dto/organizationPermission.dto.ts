import { ApiProperty } from '@nestjs/swagger'

export class OrganizationPermissionDto {
  @ApiProperty()
  permission!: string
}
