import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import {
  formatDate,
  getInitials,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  AppealSummonsAction,
  canIssueAppealSummons,
  canPerformAppealSummonsAction,
  hasFiledAppealStatement,
  isCourtOfAppealsUser,
  isDefenceUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
  isSuccessfulVerdictServiceStatus,
  verdictAppealDeclarationFileCategories,
  verdictAppealStatementFileCategories,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import {
  type AppealSummons,
  type CaseFile,
  CaseFileCategory,
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
  categories: readonly CaseFileCategory[] | CaseFileCategory[],
  file: Pick<
    CaseFile,
    'category' | 'defendantId' | 'civilClaimantId' | 'rulingFileId'
  >,
  user: User | undefined,
): boolean =>
  ((isPublicProsecutionOfficeUser(user) || isCourtOfAppealsUser(user)) &&
    Boolean(file.category && categories.includes(file.category)) &&
    // Verdict-appeal declarations are case-level. A rulingFileId belongs to a
    // ruling-order appeal and must not appear in this list.
    (file.rulingFileId ?? null) === null) ||
  isMatchingAppealCaseFile(workingCase, [...categories], file, user)

export interface VerdictAppealFileGroup {
  // Defendant declarations and that defendant's greinargerð share a group.
  // Civil-claimant and prosecution greinargerðir have no defendant row.
  defendant?: Defendant
  civilClaimant?: CivilClaimant
  files: CaseFile[]
}

const byCreatedAsc = (a: CaseFile, b: CaseFile): number =>
  new Date(a.created ?? 0).getTime() - new Date(b.created ?? 0).getTime()

// Same gate the limited-access signed-URL guard uses for indictment appeal
// files: district defenders/spokespersons with case-file access, or confirmed
// appeal advocates. Broader isDefenceUser alone would list rows the download
// guard then refuses.
export const canDefenceUserAccessVerdictAppealFiles = (
  workingCase: Pick<WorkingCase, 'defendants' | 'civilClaimants'>,
  user: User | undefined,
): boolean => {
  if (!isDefenceUser(user) || !user.nationalId) {
    return false
  }

  const ownIds = normalizeAndFormatNationalId(user.nationalId)

  return Boolean(
    workingCase.defendants?.some(
      (defendant) =>
        (defendant.isDefenderChoiceConfirmed &&
          defendant.caseFilesSharedWithDefender &&
          defendant.defenderNationalId &&
          ownIds.includes(defendant.defenderNationalId)) ||
        (defendant.isAppealDefenderConfirmed &&
          !defendant.isAppealDefenderWaived &&
          defendant.appealDefenderNationalId &&
          ownIds.includes(defendant.appealDefenderNationalId)),
    ) ||
      workingCase.civilClaimants?.some(
        (civilClaimant) =>
          (civilClaimant.hasSpokesperson &&
            civilClaimant.isSpokespersonConfirmed &&
            civilClaimant.caseFilesSharedWithSpokesperson &&
            civilClaimant.spokespersonNationalId &&
            ownIds.includes(civilClaimant.spokespersonNationalId)) ||
          (civilClaimant.hasAppealSpokesperson !== false &&
            civilClaimant.isAppealSpokespersonConfirmed &&
            civilClaimant.appealSpokespersonNationalId &&
            ownIds.includes(civilClaimant.appealSpokespersonNationalId)),
      ),
  )
}

// Greinargerð visibility mirrors kærumál once the party has filed: court of
// appeals, prosecution, and defence users who can download appeal files see
// every party's confirmed statement. Incomplete uploads stay off the overview
// until APPEAL_STATEMENT_SENT exists for that party.
export const canViewVerdictAppealStatementFile = (
  workingCase: Pick<
    WorkingCase,
    'defendants' | 'civilClaimants' | 'verdictAppealCase'
  >,
  file: Pick<
    CaseFile,
    'category' | 'defendantId' | 'civilClaimantId' | 'rulingFileId'
  >,
  user: User | undefined,
): boolean => {
  if (
    !file.category ||
    !verdictAppealStatementFileCategories.includes(file.category) ||
    (file.rulingFileId ?? null) !== null
  ) {
    return false
  }

  const canRole =
    isCourtOfAppealsUser(user) ||
    isProsecutionUser(user) ||
    isPublicProsecutionOfficeUser(user) ||
    canDefenceUserAccessVerdictAppealFiles(workingCase, user)

  if (!canRole) {
    return false
  }

  return hasFiledAppealStatement(workingCase.verdictAppealCase?.appealEventLogs, {
    defendantId: file.defendantId,
    civilClaimantId: file.civilClaimantId,
  })
}

/**
 * Appeal-process files this user may open on the verdict-appeal overview:
 * áfrýjunaryfirlýsingar (defence-scoped for defenders) and greinargerðir
 * (same roles as kærumál — CoA, prosecution, defence see every party's).
 *
 * Grouped by party in case order — defendants, then civil claimants, then a
 * prosecution group when the prosecution has filed. Files within a group are
 * oldest first.
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
    .sort(byCreatedAsc)

  const statementFiles = (workingCase.caseFiles ?? [])
    .filter((file) =>
      canViewVerdictAppealStatementFile(workingCase, file, user),
    )
    .sort(byCreatedAsc)

  const groups: VerdictAppealFileGroup[] = []

  for (const defendant of workingCase.defendants ?? []) {
    const files = [
      ...declarationFiles.filter((file) => file.defendantId === defendant.id),
      ...statementFiles.filter((file) => file.defendantId === defendant.id),
    ].sort(byCreatedAsc)

    if (files.length > 0) {
      groups.push({ defendant, files })
    }
  }

  for (const civilClaimant of workingCase.civilClaimants ?? []) {
    const files = statementFiles.filter(
      (file) => file.civilClaimantId === civilClaimant.id,
    )

    if (files.length > 0) {
      groups.push({ civilClaimant, files })
    }
  }

  const prosecutionFiles = statementFiles.filter(
    (file) =>
      file.category === CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT ||
      file.category ===
        CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT_CASE_FILE,
  )

  if (prosecutionFiles.length > 0) {
    groups.push({ files: prosecutionFiles })
  }

  return groups
}

export const getVerdictAppealFileGroupKey = (
  group: VerdictAppealFileGroup,
): string => group.defendant?.id ?? group.civilClaimant?.id ?? 'prosecution'

export const getVerdictAppealFileGroupTitle = (
  group: VerdictAppealFileGroup,
): string | undefined =>
  group.defendant?.name ?? group.civilClaimant?.name ?? 'Ákæruvaldið'

// Who sent the row in. Prefer the filer stored on the file so a later
// advocate replacement does not re-attribute an earlier upload. Fall back to
// the party's current representative for declarations registered without that
// field (e.g. letter appeals at the public prosecution office).
export const getVerdictAppealFileSentInBy = (
  group: VerdictAppealFileGroup,
  file?: Pick<CaseFile, 'submittedBy' | 'fileRepresentative' | 'category'>,
): string => {
  const storedName = file?.fileRepresentative ?? file?.submittedBy
  const isProsecutorCategory =
    file?.category === CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT ||
    file?.category ===
      CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT_CASE_FILE ||
    (!group.defendant && !group.civilClaimant)

  if (isProsecutorCategory) {
    const initials = getInitials(storedName)

    return initials ? `Ákærandi (${initials}) sendi inn` : 'Ákærandi sendi inn'
  }

  if (group.civilClaimant) {
    const initials = getInitials(
      storedName ??
        group.civilClaimant.appealSpokespersonName ??
        group.civilClaimant.spokespersonName,
    )
    const role =
      group.civilClaimant.appealSpokespersonIsLawyer ??
      group.civilClaimant.spokespersonIsLawyer
        ? 'Lögmaður'
        : 'Réttargæslumaður'

    return initials ? `${role} (${initials}) sendi inn` : `${role} sendi inn`
  }

  const initials = getInitials(
    storedName ??
      group.defendant?.appealDefenderName ??
      group.defendant?.defenderName,
  )

  return initials ? `Verjandi (${initials}) sendi inn` : 'Verjandi sendi inn'
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
