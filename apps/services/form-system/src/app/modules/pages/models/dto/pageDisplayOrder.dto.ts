import { ApiProperty } from '@nestjs/swagger'

export class PageDisplayOrderDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sectionId!: string
}
