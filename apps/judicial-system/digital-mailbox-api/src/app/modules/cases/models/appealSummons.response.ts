import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  DefenderChoice,
  isSuccessfulVerdictServiceStatus,
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

export enum AppealSummonsCounselType {
  DEFENDER = 'DEFENDER',
  SPOKESPERSON = 'SPOKESPERSON',
}

export enum AppealSummonsRecipientRole {
  DEFENDANT = 'DEFENDANT',
  CIVIL_CLAIMANT = 'CIVIL_CLAIMANT',
}

class CounselInfo {
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

class AppealSummonsData {
  @ApiProperty({ type: () => String })
  title!: string

  @ApiProperty({ type: String })
  appealSummonsInfoText!: string

  @ApiProperty({ type: String })
  subtitle?: string

  @ApiProperty({ type: () => [Groups] })
  groups!: Groups[]

  @ApiProperty({ type: () => [AlertMessage] })
  alerts?: AlertMessage[]

  @ApiProperty({ type: Boolean })
  hasBeenServed?: boolean

  @ApiProperty({ type: Boolean })
  hasChosenCounsel?: boolean

  @IsEnum(AppealSummonsCounselType)
  @ApiProperty({ enum: AppealSummonsCounselType })
  counselType!: AppealSummonsCounselType

  @IsEnum(AppealSummonsRecipientRole)
  @ApiProperty({ enum: AppealSummonsRecipientRole })
  recipientRole!: AppealSummonsRecipientRole
}

export class AppealSummonsResponse {
  @ApiProperty({ type: () => String })
  caseId!: string

  @ApiProperty({ type: () => AppealSummonsData })
  data!: AppealSummonsData

  @ApiProperty({ type: () => CounselInfo })
  counselInfo?: CounselInfo

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    nationalId: string,
    lang?: string,
  ): AppealSummonsResponse | null {
    const asDefendant = AppealSummonsResponse.fromDefendant(
      internalCase,
      nationalId,
      lang,
    )
    if (asDefendant) {
      return asDefendant
    }

    return AppealSummonsResponse.fromCivilClaimant(
      internalCase,
      nationalId,
      lang,
    )
  }

  private static fromDefendant(
    internalCase: InternalCaseResponse,
    nationalId: string,
    lang?: string,
  ): AppealSummonsResponse | null {
    const t = getTranslations(lang)
    const nationalIds = normalizeAndFormatNationalId(nationalId)

    const defendant = (internalCase.defendants ?? []).find(
      (item) => item.nationalId && nationalIds.includes(item.nationalId),
    )

    if (!defendant?.id) {
      return null
    }

    const service = AppealSummonsResponse.latestMailboxServiceForParty(
      internalCase,
      (item) => item.defendantId === defendant.id,
    )
    if (!service) {
      return null
    }

    const waivedRight = Boolean(defendant.isAppealDefenderWaived)
    const hasCounsel = Boolean(defendant.appealDefenderNationalId)
    const canEdit =
      !defendant.isAppealDefenderConfirmed && !waivedRight && !hasCounsel

    return AppealSummonsResponse.buildResponse({
      internalCase,
      service,
      recipientName: defendant.name,
      recipientLabel: t.accused,
      counselType: AppealSummonsCounselType.DEFENDER,
      recipientRole: AppealSummonsRecipientRole.DEFENDANT,
      waivedRight,
      hasCounsel,
      canEdit,
      counselName: defendant.appealDefenderName,
      infoText: t.appealSummonsInfoText,
      courtContactInfo: t.courtContactInfo,
      lang,
    })
  }

  private static fromCivilClaimant(
    internalCase: InternalCaseResponse,
    nationalId: string,
    lang?: string,
  ): AppealSummonsResponse | null {
    const t = getTranslations(lang)
    const nationalIds = normalizeAndFormatNationalId(nationalId)

    const civilClaimant = (internalCase.civilClaimants ?? []).find(
      (item) => item.nationalId && nationalIds.includes(item.nationalId),
    )

    if (!civilClaimant?.id) {
      return null
    }

    const service = AppealSummonsResponse.latestMailboxServiceForParty(
      internalCase,
      (item) => item.civilClaimantId === civilClaimant.id,
    )
    if (!service) {
      return null
    }

    // No dedicated waive column yet: waiving clears hasAppealSpokesperson and
    // spokesperson identity fields.
    const hasCounsel = Boolean(
      civilClaimant.hasAppealSpokesperson &&
        civilClaimant.appealSpokespersonNationalId,
    )
    const waivedRight =
      civilClaimant.hasAppealSpokesperson === false &&
      !civilClaimant.appealSpokespersonNationalId
    const canEdit =
      !civilClaimant.isAppealSpokespersonConfirmed &&
      !waivedRight &&
      !hasCounsel

    return AppealSummonsResponse.buildResponse({
      internalCase,
      service,
      recipientName: civilClaimant.name,
      recipientLabel: t.civilClaimant,
      counselType: AppealSummonsCounselType.SPOKESPERSON,
      recipientRole: AppealSummonsRecipientRole.CIVIL_CLAIMANT,
      waivedRight,
      hasCounsel,
      canEdit,
      counselName: civilClaimant.appealSpokespersonName,
      infoText: t.appealSummonsSpokespersonInfoText,
      courtContactInfo: t.courtContactInfoSpokesperson,
      lang,
    })
  }

  // Same presence rule as case-detail flags: only services that exist in the
  // police mailbox (externalPoliceDocumentId) are exposed to the citizen.
  private static latestMailboxServiceForParty(
    internalCase: InternalCaseResponse,
    matchesParty: (service: {
      defendantId?: string
      civilClaimantId?: string
      sentToServiceDate: Date
      externalPoliceDocumentId?: string
    }) => boolean,
  ) {
    const summonses = internalCase.verdictAppealCase?.appealSummonses ?? []

    return summonses
      .flatMap((summons) => summons.services ?? [])
      .filter(
        (service) =>
          Boolean(service.externalPoliceDocumentId) && matchesParty(service),
      )
      .sort(
        (a, b) =>
          new Date(b.sentToServiceDate).getTime() -
          new Date(a.sentToServiceDate).getTime(),
      )[0]
  }

  private static buildResponse({
    internalCase,
    service,
    recipientName,
    recipientLabel,
    counselType,
    recipientRole,
    waivedRight,
    hasCounsel,
    canEdit,
    counselName,
    infoText,
    courtContactInfo,
    lang,
  }: {
    internalCase: InternalCaseResponse
    service: {
      sentToServiceDate: Date
      serviceStatus?: Parameters<typeof isSuccessfulVerdictServiceStatus>[0]
    }
    recipientName?: string
    recipientLabel: string
    counselType: AppealSummonsCounselType
    recipientRole: AppealSummonsRecipientRole
    waivedRight: boolean
    hasCounsel: boolean
    canEdit: boolean
    counselName?: string
    infoText: string
    courtContactInfo: string
    lang?: string
  }): AppealSummonsResponse {
    const t = getTranslations(lang)
    const hasBeenServed = isSuccessfulVerdictServiceStatus(
      service.serviceStatus,
    )
    const hasChosenCounsel = waivedRight || hasCounsel
    const defenderChoice = waivedRight
      ? DefenderChoice.WAIVE
      : hasCounsel
      ? DefenderChoice.CHOOSE
      : undefined

    const courtName = internalCase.court?.name ?? t.notAvailable
    const appealCaseNumber =
      internalCase.verdictAppealCase?.appealCaseNumber ?? t.notAvailable
    const courtNameAndAddress = internalCase.court?.address
      ? `${courtName}, ${internalCase.court.address}`
      : courtName

    return {
      caseId: internalCase.id,
      data: {
        title: t.appealSummons,
        appealSummonsInfoText: infoText,
        subtitle: courtNameAndAddress,
        hasBeenServed,
        hasChosenCounsel,
        counselType,
        recipientRole,
        alerts: [
          ...(hasBeenServed
            ? [
                {
                  type: AlertMessageType.SUCCESS,
                  message: t.appealSummonsServed,
                },
              ]
            : []),
        ],
        groups: [
          {
            label: `${t.caseNumber} ${appealCaseNumber}`,
            items: [
              [t.date, formatDate(service.sentToServiceDate, 'PP')],
              [
                t.institution,
                internalCase.prosecutor?.institution?.name ??
                  internalCase.prosecutorsOffice?.name ??
                  t.notAvailable,
              ],
              [t.publicProsecutor, internalCase.prosecutor?.name],
              [recipientLabel, recipientName],
              [t.court, courtName],
              [t.courtCaseNumber, internalCase.courtCaseNumber],
            ].map((item) => ({
              label: item[0] ?? '',
              value: item[1] ?? t.notAvailable,
            })),
          },
        ],
      },
      counselInfo: defenderChoice
        ? {
            defenderChoice,
            defenderName: !waivedRight && hasCounsel ? counselName : undefined,
            canEdit,
            courtContactInfo: canEdit ? undefined : courtContactInfo,
          }
        : undefined,
    }
  }
}
