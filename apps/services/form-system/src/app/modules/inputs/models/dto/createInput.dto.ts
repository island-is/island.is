import { ApiProperty } from '@nestjs/swagger'

export class CreateInputDto {
  @ApiProperty()
  screenId!: string
}
