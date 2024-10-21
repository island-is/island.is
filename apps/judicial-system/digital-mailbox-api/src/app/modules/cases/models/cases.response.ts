import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { isCompletedCase } from '@island.is/judicial-system/types'

import { InternalCasesResponse } from './internal/internalCases.response'
import { getTranslations } from './utils/translations.strings'

enum TagVariant {
  BLUE = 'blue',
  DARKER_BLUE = 'darkerBlue',
  PURPLE = 'purple',
  WHITE = 'white',
  RED = 'red',
  ROSE = 'rose',
  BLUEBERRY = 'blueberry',
  DARK = 'dark',
  MINT = 'mint',
  YELLOW = 'yellow',
  DISABLED = 'disabled',
  WARN = 'warn',
}

class StateTag {
  @IsEnum(TagVariant)
  @ApiProperty({ enum: TagVariant })
  color!: TagVariant

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
          color: isCompletedCase(item.state)
            ? TagVariant.PURPLE
            : TagVariant.BLUE,
          label: isCompletedCase(item.state) ? t.completed : t.active,
        },
        caseNumber: `${t.caseNumber} ${item.courtCaseNumber}`,
        type: t.indictment,
      }
    })
  }
}
