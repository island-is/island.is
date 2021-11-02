import { ApiProperty } from '@nestjs/swagger'

export class SpouseResponse {
  @ApiProperty()
  hasApplied: boolean

  @ApiProperty()
  hasFiles: boolean
}
