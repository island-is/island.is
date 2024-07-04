import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { DateType, DefenderChoice } from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import { Groups } from './shared/groups.model'
import { getTranslations } from './utils/translations.strings'

class DefenderInfo {
  @IsEnum(DefenderChoice)
  @ApiProperty({ enum: DefenderChoice })
  defenderChoice!: DefenderChoice

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

    const waivedRight = defendantInfo?.defenderChoice === DefenderChoice.WAIVE
    const hasDefender = defendantInfo?.defenderName !== undefined

    const subpoenaDateLog = internalCase.dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.ARRAIGNMENT_DATE,
    )
    const arraignmentDate = subpoenaDateLog?.date ?? ''
    const subpoenaCreatedDate = subpoenaDateLog?.created ?? ''

    return {
      caseId: internalCase.id,
      data: {
        title: t.subpoena,
        groups: [
          {
            label: `${t.caseNumber} ${internalCase.courtCaseNumber}`,
            items: [
              [t.date, formatDate(subpoenaCreatedDate, 'PP')],
              [t.institution, 'Lögreglustjórinn á höfuðborgarsvæðinu'],
              [t.prosecutor, internalCase.prosecutor?.name],
              [t.accused, defendantInfo?.name],
              [
                t.arraignmentDate,
                formatDate(arraignmentDate, "d.M.yyyy 'kl.' HH:mm"),
              ],
              [t.location, subpoenaDateLog?.location ?? ''],
              [t.courtCeremony, t.parliamentaryConfirmation],
            ].map((item) => ({
              label: item[0] ?? '',
              value: item[1] ?? t.notAvailable,
            })),
          },
        ],
      },

      defenderInfo: defendantInfo?.defenderChoice
        ? {
            defenderChoice: defendantInfo?.defenderChoice,
            defenderName:
              !waivedRight && hasDefender
                ? defendantInfo?.defenderName
                : undefined,
          }
        : undefined,
      acceptCompensationClaim: defendantInfo?.acceptCompensationClaim,
    }
  }
}
