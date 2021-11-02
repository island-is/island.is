import { ApiProperty } from '@nestjs/swagger'

export class SpouseResponse {
  @ApiProperty()
  HasApplied: boolean

  @ApiProperty()
  hasFiles: boolean
}
