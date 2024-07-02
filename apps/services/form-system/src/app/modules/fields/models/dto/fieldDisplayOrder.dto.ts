import { ApiProperty } from '@nestjs/swagger'

export class FieldDisplayOrderDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  screenId!: string
}
