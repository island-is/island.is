import { ApiProperty } from '@nestjs/swagger'

import { isCompletedCase } from '@island.is/judicial-system/types'

import { InternalCasesResponse } from './internal/internalCases.response'

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

  static fromInternalCasesResponse(
    response: InternalCasesResponse[],
    lang?: string,
  ): CasesResponse[] {
    return response.map((item: InternalCasesResponse) => {
      const language = lang?.toLowerCase()

      return {
        id: item.id,
        state: {
          color: isCompletedCase(item.state) ? 'purple' : 'blue',
          label:
            language === 'en'
              ? isCompletedCase(item.state)
                ? 'Completed'
                : 'Active'
              : isCompletedCase(item.state)
              ? 'Lokið'
              : 'Í vinnslu',
        },
        caseNumber:
          language === 'en'
            ? `Case number ${item.courtCaseNumber}`
            : `Málsnúmer ${item.courtCaseNumber}`,
        type: language === 'en' ? 'Indictment' : 'Ákæra',
      }
    })
  }
}
