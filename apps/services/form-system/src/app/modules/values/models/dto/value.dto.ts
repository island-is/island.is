import { ApiProperty } from '@nestjs/swagger'

export class ValueDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  json?: string
}
