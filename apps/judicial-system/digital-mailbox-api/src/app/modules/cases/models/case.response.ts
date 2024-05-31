import { ApiProperty } from '@nestjs/swagger'

class IndictmentCaseData {
  @ApiProperty({ type: String })
  caseNumber!: string

  @ApiProperty({ type: Object })
  groups!: Groups[]
}

class Groups {
  @ApiProperty({ type: String })
  label!: string

  @ApiProperty({ type: Object })
  items!: Items[]
}

class Items {
  @ApiProperty({ type: String })
  label!: string

  @ApiProperty({ type: String })
  value?: string

  @ApiProperty({ type: String })
  linkType?: 'email' | 'tel'
}

export class CaseResponse {
  @ApiProperty({ type: Object })
  data!: IndictmentCaseData
}
