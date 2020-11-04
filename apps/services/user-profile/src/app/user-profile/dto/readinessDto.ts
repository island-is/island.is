import { ApiProperty } from '@nestjs/swagger'

export class Readiness {
  @ApiProperty()
  ok!: boolean
}
