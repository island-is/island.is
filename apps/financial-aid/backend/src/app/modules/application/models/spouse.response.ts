import { ApiProperty } from '@nestjs/swagger'

export class SpouseResponse {
  @ApiProperty()
  hasPartnerApplied: boolean

  @ApiProperty()
  hasFiles: boolean

  @ApiProperty()
  applicantName: string

  @ApiProperty()
  applicantSpouseEmail: string
}
