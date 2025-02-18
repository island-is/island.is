import { ApiProperty } from '@nestjs/swagger'

export class OrganizationListTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  listTypeId!: string
}
