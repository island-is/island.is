import { ApiProperty } from '@nestjs/swagger'

import { isCompletedCase } from '@island.is/judicial-system/types'

import { InternalCasesResponse } from './internal/internalCases.response'
import { getTranslations } from './utils/translations.strings'

class StateTag {
  @ApiProperty({ type: String })
  color!: string

  @ApiProperty({ type: String })
  label!: string
}

export class CasesResponse {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: String })
  caseNumber!: string

  @ApiProperty({ type: String })
  type!: string

  @ApiProperty({ type: StateTag })
  state!: StateTag

  static fromInternalCasesResponse(
    response: InternalCasesResponse[],
    lang?: string,
  ): CasesResponse[] {
    return response.map((item: InternalCasesResponse) => {
      const t = getTranslations(lang)

      return {
        id: item.id,
        state: {
          color: isCompletedCase(item.state) ? 'purple' : 'blue',
          label: isCompletedCase(item.state) ? t.completed : t.active,
        },
        caseNumber: `${t.caseNumber} ${item.courtCaseNumber}`,
        type: t.indictment,
      }
    })
  }
}
