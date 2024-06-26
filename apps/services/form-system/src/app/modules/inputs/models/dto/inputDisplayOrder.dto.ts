import { ApiProperty } from '@nestjs/swagger'

export class InputDisplayOrderDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  groupId!: string
}
