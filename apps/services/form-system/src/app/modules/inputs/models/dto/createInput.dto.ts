import { ApiProperty } from '@nestjs/swagger'

export class CreateInputDto {
  @ApiProperty()
  groupId!: string
}
