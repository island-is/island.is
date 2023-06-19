import { ApiProperty } from '@nestjs/swagger'

export class PoliceCaseInfo {
  @ApiProperty()
  caseNumber!: string
  @ApiProperty()
  crimeScene?: string
  @ApiProperty()
  crimeDate?: Date
}
