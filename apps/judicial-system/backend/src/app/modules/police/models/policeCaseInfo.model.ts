import { ApiProperty } from '@nestjs/swagger'

import { PoliceCaseInfo as TPoliceCaseInfo } from '@island.is/judicial-system/types'

export class PoliceCaseInfo implements TPoliceCaseInfo {
  @ApiProperty()
  caseNumber!: string
}
