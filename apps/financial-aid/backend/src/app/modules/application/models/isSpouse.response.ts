import { ApiProperty } from '@nestjs/swagger'

export class IsSpouseResponse {
  @ApiProperty()
  HasApplied: boolean

  @ApiProperty()
  HasSpouseFiles: boolean
}
