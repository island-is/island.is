import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  AppealSummonsAction,
  canIssueAppealSummons,
  canPerformAppealSummonsAction,
  isCourtOfAppealsUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
  isSuccessfulVerdictServiceStatus,
  verdictAppealDeclarationFileCategories,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import {
  type AppealSummons,
  type CaseFile,
  type CaseFileCategory,
  type CivilClaimant,
  type Defendant,
  type User,
  VerdictServiceStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isMatchingAppealCaseFile } from '@island.is/judicial-system-web/src/utils/utils'

import { hasStandingVerdictAppeal } from '../AppealAppointmentLetter/AppealAppointmentLetter.logic'

// Re-exported because this is where the section's callers and its spec have
// always asked for them; the rules themselves are shared with the advocate
// screen and live beside it.
export {
  getAppealAppointmentLetters,
  hasStandingVerdictAppeal,
} from '../AppealAppointmentLetter/AppealAppointmentLetter.logic'
export type { AppealAppointmentLetterRow } from '../AppealAppointmentLetter/AppealAppointmentLetter.logic'

// Whether this user may open a verdict appeal file of one of the given
// categories.
//
// Two roles see every declaration and are named here because the shared
// appeal-file rule does not know them: the public prosecution office, which
// acts on the appeal and registers the ones arriving by letter, and the court
// of appeals, to which the declaration is one of the documents the appeal
// arrives with. Everyone else is governed by that rule - prosecution sees all,
// a defender their own clients'.
export const canViewVerdictAppealFile = (
  workingCase: WorkingCase,
  categories: CaseFileCategory[],
  file: Pick<CaseFile, 'category' | 'defendantId' | 'civilClaimantId'>,
  user: User | undefined,
): boolean =>
  ((isPublicProsecutionOfficeUser(user) || isCourtOfAppealsUser(user)) &&
    Boolean(file.category && categories.includes(file.category))) ||
  isMatchingAppealCaseFile(workingCase, categories, file, user)

export interface VerdictAppealFileGroup {
  defendant: Defendant
  files: CaseFile[]
}

/**
 * The appeal declaration and its accompanying files that this user may open,
 * grouped by the defendant they were filed for, in the order the defendants
 * appear on the case and the order the files were filed. A defence user only
 * sees the files of the defendants they represent, the same rule that governs
 * every other party appeal file.
 */
export const getVerdictAppealFileGroups = (
  workingCase: WorkingCase,
  user: User | undefined,
): VerdictAppealFileGroup[] => {
  const declarationFiles = (workingCase.caseFiles ?? [])
    .filter((file) =>
      canViewVerdictAppealFile(
        workingCase,
        verdictAppealDeclarationFileCategories,
        file,
        user,
      ),
    )
    .sort(
      (a, b) =>
        new Date(a.created ?? 0).getTime() - new Date(b.created ?? 0).getTime(),
    )

  return (workingCase.defendants ?? []).flatMap((defendant) => {
    const files = declarationFiles.filter(
      (file) => file.defendantId === defendant.id,
    )

    return files.length > 0 ? [{ defendant, files }] : []
  })
}

export const showsAppealSummonses = (
  workingCase: Pick<WorkingCase, 'verdictAppealCase'>,
  user: User | undefined,
): boolean => {
  if (!hasStandingVerdictAppeal(workingCase.verdictAppealCase)) {
    return false
  }

  if (isPublicProsecutionOfficeUser(user) || isPublicProsecutionUser(user)) {
    return true
  }

  if (isCourtOfAppealsUser(user)) {
    return (workingCase.verdictAppealCase?.sentAppealSummonses?.length ?? 0) > 0
  }

  return false
}

export const getAppealSummonsRows = (
  workingCase: Pick<WorkingCase, 'verdictAppealCase'>,
  user: User | undefined,
): AppealSummons[] => {
  if (isCourtOfAppealsUser(user)) {
    return workingCase.verdictAppealCase?.sentAppealSummonses ?? []
  }

  return workingCase.verdictAppealCase?.appealSummonses ?? []
}

export const canConfirmAppealSummonsRow = (
  summons: Pick<AppealSummons, 'confirmedDate' | 'sentToCourtOfAppealsDate'>,
  user: User | undefined,
): boolean =>
  canPerformAppealSummonsAction(AppealSummonsAction.CONFIRM, summons, user)

export const formatAppealSummonsConfirmedDate = (
  confirmedDate?: string | null,
): string | undefined => {
  if (!confirmedDate) {
    return undefined
  }

  const date = formatDate(confirmedDate, 'dd.MM.y')
  const time = formatDate(confirmedDate, TIME_FORMAT)

  if (!date || !time) {
    return undefined
  }

  return `${date} kl. ${time}`
}

export const formatAppealSummonsSentToCourtOfAppealsTooltip = (
  sentToCourtOfAppealsDate?: string | null,
): string | undefined => {
  if (!sentToCourtOfAppealsDate) {
    return undefined
  }

  const date = formatDate(sentToCourtOfAppealsDate, 'dd.MM.y')

  return date ? `Sent til Landsréttar ${date}` : undefined
}

export const canShowIssueAppealSummons = (
  workingCase: Pick<WorkingCase, 'verdictAppealCase'>,
  user: User | undefined,
): boolean =>
  canIssueAppealSummons(
    user,
    hasStandingVerdictAppeal(workingCase.verdictAppealCase),
  )

export const formatAppealSummonsFileName = (
  summons: Pick<AppealSummons, 'created'>,
): string => {
  const date = formatDate(summons.created, 'dd.MM.y')

  return date ? `Áfrýjunarstefna ${date}.pdf` : 'Áfrýjunarstefna.pdf'
}

export const getAppealSummonsMenuItems = (
  summons: Pick<
    AppealSummons,
    'confirmedDate' | 'sentToCourtOfAppealsDate' | 'services'
  >,
  user: User | undefined,
  onEdit: () => void,
  onOpen: () => void,
  onDelete: () => void,
  onSendToService?: () => void,
  onSendToCourtOfAppeals?: () => void,
): ContextMenuItem[] => {
  const items: ContextMenuItem[] = []

  if (
    onSendToService &&
    canPerformAppealSummonsAction(
      AppealSummonsAction.SEND_TO_SERVICE,
      summons,
      user,
    )
  ) {
    items.push({
      title: 'Senda í birtingu',
      onClick: onSendToService,
      icon: 'mail',
    })
  }

  if (
    onSendToCourtOfAppeals &&
    canPerformAppealSummonsAction(
      AppealSummonsAction.SEND_TO_COURT_OF_APPEALS,
      summons,
      user,
    )
  ) {
    items.push({
      title: 'Senda til Landsréttar',
      onClick: onSendToCourtOfAppeals,
      icon: 'arrowForward',
    })
  }

  if (canPerformAppealSummonsAction(AppealSummonsAction.EDIT, summons, user)) {
    items.push({ title: 'Breyta', onClick: onEdit, icon: 'pencil' })
  }

  if (canPerformAppealSummonsAction(AppealSummonsAction.OPEN, summons, user)) {
    items.push({ title: 'Opna í nýjum flipa', onClick: onOpen, icon: 'open' })
  }

  if (
    canPerformAppealSummonsAction(AppealSummonsAction.DELETE, summons, user)
  ) {
    items.push({ title: 'Eyða', onClick: onDelete, icon: 'trash' })
  }

  return items
}

export type AppealSummonsServiceRecipientOption = {
  key: string
  label: string
  defendantId?: string
  civilClaimantId?: string
  alreadySent: boolean
  missingNationalId: boolean
}

const recipientHasNationalId = (
  recipient:
    | Pick<Defendant, 'nationalId' | 'noNationalId'>
    | Pick<CivilClaimant, 'nationalId' | 'noNationalId'>
    | null
    | undefined,
): boolean =>
  Boolean(recipient) &&
  !recipient?.noNationalId &&
  Boolean(recipient?.nationalId)

export const getAppealSummonsServiceRecipientOptions = (
  summons: Pick<AppealSummons, 'defendants' | 'services'>,
  defendants: Defendant[] | null | undefined,
  civilClaimants: CivilClaimant[] | null | undefined,
): AppealSummonsServiceRecipientOption[] => {
  const services = summons.services ?? []
  const options: AppealSummonsServiceRecipientOption[] = []

  for (const row of summons.defendants ?? []) {
    const defendant = defendants?.find((item) => item.id === row.defendantId)
    const missingNationalId = !recipientHasNationalId(defendant)
    const name = `Dómfelldi ${defendant?.name ?? ''}`.trim()

    options.push({
      key: `defendant-${row.defendantId}`,
      label: missingNationalId ? `${name} (vantar kennitölu)` : name,
      defendantId: row.defendantId,
      alreadySent: services.some(
        (service) => service.defendantId === row.defendantId,
      ),
      missingNationalId,
    })
  }

  for (const claimant of civilClaimants ?? []) {
    const missingNationalId = !recipientHasNationalId(claimant)
    const name = claimant.name ?? ''

    options.push({
      key: `civilClaimant-${claimant.id}`,
      label: missingNationalId ? `${name} (vantar kennitölu)`.trim() : name,
      civilClaimantId: claimant.id,
      alreadySent: services.some(
        (service) => service.civilClaimantId === claimant.id,
      ),
      missingNationalId,
    })
  }

  return options
}

export type AppealSummonsServiceBanner = {
  key: string
  title: string
  message: string
  type: 'info' | 'success' | 'error'
}

export const getAppealSummonsServiceBanners = (
  workingCase: WorkingCase,
): AppealSummonsServiceBanner[] => {
  const summonses = workingCase.verdictAppealCase?.appealSummonses ?? []
  const banners: AppealSummonsServiceBanner[] = []

  for (const summons of summonses) {
    for (const service of summons.services ?? []) {
      const name = service.defendantId
        ? workingCase.defendants?.find(
            (defendant) => defendant.id === service.defendantId,
          )?.name
        : workingCase.civilClaimants?.find(
            (claimant) => claimant.id === service.civilClaimantId,
          )?.name

      if (service.serviceStatus === VerdictServiceStatus.FAILED) {
        banners.push({
          key: service.id,
          type: 'error',
          title: `Birting áfrýjunarstefnu mistókst${name ? ` – ${name}` : ''}`,
          message: service.comment?.trim()
            ? service.comment
            : 'Ekki tókst að birta áfrýjunarstefnuna',
        })
        continue
      }

      if (isSuccessfulVerdictServiceStatus(service.serviceStatus)) {
        const isLegalPaper =
          service.serviceStatus === VerdictServiceStatus.LEGAL_PAPER
        const servedAt = !service.serviceDate
          ? undefined
          : isLegalPaper
          ? formatDate(service.serviceDate)
          : `${formatDate(service.serviceDate)} kl. ${formatDate(
              service.serviceDate,
              TIME_FORMAT,
            )}`

        banners.push({
          key: service.id,
          type: 'success',
          title: isLegalPaper
            ? `Áfrýjunarstefna birt í Lögbirtingablaðinu${
                name ? ` – ${name}` : ''
              }`
            : `Áfrýjunarstefna birt${name ? ` – ${name}` : ''}`,
          message: isLegalPaper
            ? servedAt
              ? `Birt í Lögbirtingablaðinu ${servedAt}`
              : 'Birt í Lögbirtingablaðinu'
            : servedAt
            ? `Birt ${servedAt}`
            : 'Birt',
        })
        continue
      }

      if (!service.sentToServiceDate) {
        continue
      }

      const sentAt = `${formatDate(service.sentToServiceDate)} kl. ${formatDate(
        service.sentToServiceDate,
        TIME_FORMAT,
      )}`

      banners.push({
        key: service.id,
        type: 'info',
        title: `Áfrýjunarstefna bíður birtingar${name ? ` – ${name}` : ''}`,
        message: `Send í birtingu ${sentAt}`,
      })
    }
  }

  return banners
}
