import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class SignatureDto {
  @IsUUID(4)
  @ApiProperty()
  listId!: string
}
