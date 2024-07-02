import { ApiProperty } from '@nestjs/swagger'

export class ScreenDisplayOrderDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sectionId!: string
}
