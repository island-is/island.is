import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { getIntro } from '@island.is/judicial-system/consts'
import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  DateType,
  DefenderChoice,
  isSuccessfulServiceStatus,
  SubpoenaType,
} from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import { Groups } from './shared/groups.model'
import { getTranslations } from './utils/translations.strings'

enum AlertMessageType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  DEFAULT = 'default',
}

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
  @IsEnum(AlertMessageType)
  @ApiProperty({ enum: AlertMessageType })
  type?: AlertMessageType

  @ApiProperty({ type: () => String })
  message?: string
}

class SubpoenaData {
  @ApiProperty({ type: () => String })
  title!: string

  @ApiProperty({ type: String })
  subpoenaInfoText!: string

  @ApiProperty({ type: String })
  subpoenaNotificationDeadline!: string

  @ApiProperty({ type: String })
  subtitle?: string

  @ApiProperty({ type: () => [Groups] })
  groups!: Groups[]

  @ApiProperty({ type: () => [AlertMessage] })
  alerts?: AlertMessage[]

  @ApiProperty({ type: Boolean })
  hasBeenServed?: boolean

  @ApiProperty({ type: Boolean })
  hasChosenDefender?: boolean

  @ApiProperty({ enum: DefenderChoice })
  defaultDefenderChoice?: DefenderChoice
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
    // TODO: Change to latestSubpoena.type
    const subpoenaType = defendantInfo?.subpoenaType

    const intro = getIntro(defendantInfo?.gender, lang)
    const formatedSubpoenaInfoText = `${intro.intro}${
      subpoenaType
        ? ` ${
            subpoenaType === SubpoenaType.ABSENCE
              ? intro.absenceIntro
              : intro.arrestIntro
          }`
        : ''
    }`

    const waivedRight =
      defendantInfo?.requestedDefenderChoice === DefenderChoice.WAIVE
    const hasDefender = defendantInfo?.requestedDefenderNationalId !== null
    const subpoenas = defendantInfo?.subpoenas ?? []

    const latestSubpoena = subpoenas.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    )[0]

    const hasBeenServed =
      subpoenas.length > 0 &&
      isSuccessfulServiceStatus(latestSubpoena.serviceStatus)
    const canChangeDefenseChoice = !waivedRight && !hasDefender

    const subpoenaDateLog = internalCase.dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.ARRAIGNMENT_DATE,
    )
    const arraignmentDate = subpoenaDateLog?.date ?? ''
    const subpoenaCreatedDate = subpoenaDateLog?.created ?? '' //TODO: Change to subpoena created in RLS
    const courtName = internalCase.court?.name ?? t.notAvailable
    const arraignmentLocation = subpoenaDateLog?.location
      ? `${courtName}, Dómsalur ${subpoenaDateLog.location}`
      : courtName
    const courtNameAndAddress = `${courtName}, ${internalCase.court?.address}`

    return {
      caseId: internalCase.id,
      data: {
        title: t.subpoena,
        subpoenaInfoText: formatedSubpoenaInfoText,
        subpoenaNotificationDeadline: intro.deadline,
        subtitle: courtNameAndAddress,
        hasBeenServed: hasBeenServed,
        hasChosenDefender: Boolean(
          defendantInfo?.requestedDefenderChoice &&
            defendantInfo.requestedDefenderChoice !== DefenderChoice.DELAY,
        ),
        defaultDefenderChoice: DefenderChoice.DELAY,
        alerts: [
          ...(hasBeenServed
            ? [
                {
                  type: AlertMessageType.SUCCESS,
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

      defenderInfo: defendantInfo?.requestedDefenderChoice
        ? {
            defenderChoice: defendantInfo?.requestedDefenderChoice,
            defenderName:
              !waivedRight && hasDefender
                ? defendantInfo?.requestedDefenderName
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
