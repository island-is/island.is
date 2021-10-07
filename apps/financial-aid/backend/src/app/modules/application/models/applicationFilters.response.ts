import { ApiProperty } from '@nestjs/swagger'

export class ApplicationFilterResponse {
  @ApiProperty()
  New: number

  @ApiProperty()
  InProgress: number

  @ApiProperty()
  DataNeeded: number

  @ApiProperty()
  Rejected: number

  @ApiProperty()
  Approved: number
}
