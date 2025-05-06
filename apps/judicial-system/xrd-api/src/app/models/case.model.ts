import { ApiProperty } from '@nestjs/swagger'

export class Case {
  @ApiProperty()
  id!: string
}
