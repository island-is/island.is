import { ApiProperty } from '@nestjs/swagger'

export class GroupDisplayOrderDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  stepId!: string
}
