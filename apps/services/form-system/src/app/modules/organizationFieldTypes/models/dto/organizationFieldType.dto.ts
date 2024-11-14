import { ApiProperty } from '@nestjs/swagger'

export class OrganizationFieldTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  fieldTypeId!: string
}
