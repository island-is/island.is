import { ApiProperty } from '@nestjs/swagger'

export class CreateListItemDto {
  @ApiProperty()
  fieldId!: string

  @ApiProperty()
  displayOrder!: number
}
