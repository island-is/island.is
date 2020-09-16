import { ApiProperty } from '@nestjs/swagger'

export class Liveness {
  @ApiProperty()
  ok!: boolean
}
