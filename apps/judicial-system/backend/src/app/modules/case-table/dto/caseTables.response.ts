import { ApiProperty } from '@nestjs/swagger'

import { CaseTableType } from '@island.is/judicial-system/types'

class CaseTableDesctiptor {
  @ApiProperty({ enum: CaseTableType, description: 'The table type' })
  readonly type!: CaseTableType

  @ApiProperty({ type: String, description: 'The table title' })
  readonly title!: string

  @ApiProperty({ type: String, description: 'The table description' })
  readonly description!: string
}

class CaseTableGroup {
  @ApiProperty({ type: String, description: 'The group title' })
  readonly title!: string

  @ApiProperty({ type: [CaseTableDesctiptor], description: 'The group tables' })
  readonly tables!: CaseTableDesctiptor[]
}

export class CaseTablesResponse {
  @ApiProperty({
    type: [CaseTableGroup],
    description: 'The available table groups',
  })
  readonly groups!: CaseTableGroup[]
}
