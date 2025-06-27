import { ApiProperty } from '@nestjs/swagger'

import { CaseType } from '@island.is/judicial-system/types'

class SearchCasesRow {
  @ApiProperty({ type: String, description: 'The case id' })
  readonly caseId!: string

  @ApiProperty({ enum: CaseType, description: 'The case type' })
  readonly caseType!: CaseType

  @ApiProperty({ type: String, description: 'The matched field' })
  readonly matchedField!: string

  @ApiProperty({ type: String, description: 'The matched value' })
  readonly matchedValue!: string

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'The police case numbers',
  })
  readonly policeCaseNumbers!: string[]

  @ApiProperty({ type: String, description: 'The court case number' })
  readonly courtCaseNumber!: string | null

  @ApiProperty({ type: String, description: 'The appeal case number' })
  readonly appealCaseNumber!: string | null

  @ApiProperty({ type: String, description: 'The defendant national id' })
  readonly defendantNationalId!: string | null

  @ApiProperty({ type: String, description: 'The defendant name' })
  readonly defendantName!: string | null
}

export class SearchCasesResponse {
  @ApiProperty({
    type: Number,
    description: 'The total number of search results',
  })
  readonly rowCount!: number

  @ApiProperty({
    type: SearchCasesRow,
    isArray: true,
    description: 'The search results',
  })
  readonly rows!: SearchCasesRow[]
}
