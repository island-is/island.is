import { ApiProperty } from '@nestjs/swagger'

export class ListItemDisplayOrderDto {
  @ApiProperty()
  id!: string
}
