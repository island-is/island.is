import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import {
  formatDate,
  normalizeAndFormatNationalId,
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

  @ApiProperty({ type: () => Boolean })
  canEdit?: boolean

  @ApiProperty({ type: () => String })
  courtContactInfo?: string
}

class AlertMessage {
  @ApiProperty({ type: () => String })
  type!: string

  @ApiProperty({ type: () => String })
  message!: string
}

class SubpoenaData {
  @ApiProperty({ type: () => String })
  title!: string

  @ApiProperty({ type: () => [AlertMessage] })
  alerts?: AlertMessage[]

  @ApiProperty({ type: () => [Groups] })
  groups!: Groups[]

  @ApiProperty({ type: Boolean })
  hasBeenServed?: boolean
}

export class SubpoenaResponse {
  @ApiProperty({ type: () => String })
  caseId!: string

  @ApiProperty({ type: () => SubpoenaData })
  data!: SubpoenaData

  @ApiProperty({ type: () => DefenderInfo })
  defenderInfo?: DefenderInfo

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    defendantNationalId: string,
    lang?: string,
  ): SubpoenaResponse {
    const t = getTranslations(lang)

    const defendantInfo = internalCase.defendants.find(
      (defendant) =>
        defendant.nationalId &&
        normalizeAndFormatNationalId(defendantNationalId).includes(
          defendant.nationalId,
        ),
    )

    const waivedRight = defendantInfo?.defenderChoice === DefenderChoice.WAIVE
    const hasDefender = defendantInfo?.defenderName !== undefined
    const subpoena = defendantInfo?.subpoenas ?? []
    const hasBeenServed = subpoena[0]?.acknowledged ?? false
    const canChangeDefenseChoice = !waivedRight && !hasDefender

    const subpoenaDateLog = internalCase.dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.ARRAIGNMENT_DATE,
    )
    const arraignmentDate = subpoenaDateLog?.date ?? ''
    const subpoenaCreatedDate = subpoenaDateLog?.created ?? '' //TODO: Change to subpoena created in RLS
    const arraignmentLocation = subpoenaDateLog?.location
      ? `${internalCase.court.name}, Dómsalur ${subpoenaDateLog.location}`
      : internalCase.court.name

    return {
      caseId: internalCase.id,
      data: {
        title: t.subpoena,
        hasBeenServed: hasBeenServed,
        alerts: [
          ...(hasBeenServed
            ? [
                {
                  type: 'success',
                  message: t.subpoenaServed,
                },
              ]
            : []),
        ],
        groups: [
          {
            label: `${t.caseNumber} ${internalCase.courtCaseNumber}`,
            items: [
              [t.date, formatDate(subpoenaCreatedDate, 'PP')],
              [
                t.institution,
                internalCase.prosecutor?.institution?.name ?? t.notAvailable,
              ],
              [t.prosecutor, internalCase.prosecutor?.name],
              [t.accused, defendantInfo?.name],
              [
                t.arraignmentDate,
                formatDate(arraignmentDate, "d.M.yyyy 'kl.' HH:mm"),
              ],
              [t.location, arraignmentLocation],
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
            canEdit: canChangeDefenseChoice,
            courtContactInfo: canChangeDefenseChoice
              ? undefined
              : t.courtContactInfo,
          }
        : undefined,
    }
  }
}
