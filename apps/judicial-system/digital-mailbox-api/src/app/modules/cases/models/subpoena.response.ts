import { ApiProperty } from '@nestjs/swagger'

import { DefenderChoice } from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'

class DefenderInfo {
  @ApiProperty({ enum: () => DefenderChoice })
  defenderChoice?: DefenderChoice

  @ApiProperty({ type: () => String })
  defenderName?: string
}

export class SubpoenaResponse {
  @ApiProperty({ type: () => String })
  caseId!: string

  @ApiProperty({ type: () => String })
  displayInfo?: string

  @ApiProperty({ type: () => DefenderInfo })
  defenderInfo?: DefenderInfo

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    defendantNationalId: string,
    lang?: string,
  ): SubpoenaResponse {
    const defendantInfo = internalCase.defendants.find(
      (defendant) => defendant.nationalId === defendantNationalId,
    )

    return {
      caseId: internalCase.id,
      displayInfo: lang === 'en' ? 'Subpoena' : 'Þingbók',
      defenderInfo: {
        defenderChoice: defendantInfo?.defenderChoice,
        defenderName: defendantInfo?.defenderName,
      },
    }
  }
}
