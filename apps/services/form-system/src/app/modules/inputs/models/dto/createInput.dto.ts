import { ApiProperty } from '@nestjs/swagger'
import { InputType } from '../inputType.model'

export class CreateInputDto {
  @ApiProperty()
  groupId!: string
}
