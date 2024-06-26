import { ApiProperty } from '@nestjs/swagger'

export class CreateListItemDto {
  @ApiProperty()
  inputId!: string

  @ApiProperty()
  displayOrder!: number
}
