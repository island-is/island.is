import { ApiProperty } from '@nestjs/swagger'

import { formatNationalId } from '@island.is/judicial-system/formatters'
import { DateType, DefenderChoice } from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import { Groups } from './shared/groups.model'
import { getTranslations } from './utils/translations.strings'

class DefenderInfo {
  @ApiProperty({ enum: () => DefenderChoice })
  defenderChoice?: DefenderChoice

  @ApiProperty({ type: () => String })
  defenderName?: string
}

class SubpoenaData {
  @ApiProperty({ type: () => String })
  title!: string
  @ApiProperty({ type: () => [Groups] })
  groups!: Groups[]
}

export class SubpoenaResponse {
  @ApiProperty({ type: () => String })
  caseId!: string

  @ApiProperty({ type: () => SubpoenaData })
  data!: SubpoenaData

  @ApiProperty({ type: () => DefenderInfo })
  defenderInfo?: DefenderInfo

  @ApiProperty({ type: () => Boolean })
  acceptCompensationClaim?: boolean

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    defendantNationalId: string,
    lang?: string,
  ): SubpoenaResponse {
    const formattedNationalId = formatNationalId(defendantNationalId)
    const t = getTranslations(lang)

    const defendantInfo = internalCase.defendants.find(
      (defendant) =>
        defendant.nationalId === formattedNationalId ||
        defendant.nationalId === defendantNationalId,
    )

    const hasDefender = defendantInfo?.defenderChoice !== DefenderChoice.WAIVE

    const subpoenaDate = internalCase.dateLog?.find(
      (dateLog) => dateLog.dateType === DateType.ARRAIGNMENT_DATE,
    )
    return {
      caseId: internalCase.id,
      data: {
        title: t.subpoena,
        groups: [
          {
            label: `${t.caseNumber} ${internalCase.courtCaseNumber}`,
            items: [
              [t.date, subpoenaDate?.created.toDateString()],
              [t.institution, 'Lögreglustjórinn á höfuðborgarsvæðinu'],
              [t.prosecutor, internalCase.prosecutor?.name],
              [t.accused, defendantInfo?.name],
              [t.arraignmentDate, subpoenaDate?.date.toDateString()],
              [t.location, subpoenaDate?.location],
              [t.courtCeremony, t.parliamentaryConfirmation],
            ].map((item) => ({
              label: item[0] ?? '',
              value: item[1] ?? t.notAvailable,
            })),
          },
        ],
      },

      defenderInfo: defendantInfo
        ? {
            defenderChoice: defendantInfo?.defenderChoice,
            defenderName: hasDefender ? defendantInfo?.defenderName : undefined,
          }
        : undefined,
      acceptCompensationClaim: defendantInfo?.acceptCompensationClaim,
    }
  }
}
