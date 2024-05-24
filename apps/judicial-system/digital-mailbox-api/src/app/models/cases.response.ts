import { ApiProperty } from '@nestjs/swagger'

export class CasesResponse {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: String })
  caseNumber!: string

  @ApiProperty({ type: String })
  type!: string

  @ApiProperty({ type: Object })
  state!: {
    color: string
    label: string
  }
}
