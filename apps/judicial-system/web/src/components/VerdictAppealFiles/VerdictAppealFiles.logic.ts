import { formatDate } from '@island.is/judicial-system/formatters'
import {
  AppealSummonsAction,
  canIssueAppealSummons,
  canPerformAppealSummonsAction,
  isCourtOfAppealsUser,
  isPublicProsecutionOfficeUser,
  verdictAppealDeclarationFileCategories,
} from '@island.is/judicial-system/types'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import {
  type AppealCase,
  AppealCaseState,
  type AppealSummons,
  type Case,
  type CaseFile,
  type CaseFileCategory,
  type Defendant,
  type User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isMatchingAppealCaseFile } from '@island.is/judicial-system-web/src/utils/utils'

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
  workingCase: Case,
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
  workingCase: Case,
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

/**
 * Whether a verdict appeal currently stands. The association row persists after
 * withdrawal (and is reused if someone re-appeals within the deadline), so a
 * present `verdictAppealCase` alone is not enough.
 */
export const hasStandingVerdictAppeal = (
  verdictAppealCase?: Pick<AppealCase, 'appealState'> | null,
): boolean =>
  Boolean(verdictAppealCase) &&
  verdictAppealCase?.appealState !== AppealCaseState.WITHDRAWN

export const showsAppealSummonses = (
  workingCase: Pick<Case, 'verdictAppealCase'>,
  user: User | undefined,
  isIndictmentAppealEnabled: boolean,
): boolean =>
  isIndictmentAppealEnabled &&
  isPublicProsecutionOfficeUser(user) &&
  hasStandingVerdictAppeal(workingCase.verdictAppealCase)

export const canShowIssueAppealSummons = (
  workingCase: Pick<Case, 'verdictAppealCase'>,
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
  summons: Pick<AppealSummons, 'confirmedDate' | 'sentToCourtOfAppealsDate'>,
  user: User | undefined,
  onEdit: () => void,
  onOpen: () => void,
): ContextMenuItem[] => {
  const items: ContextMenuItem[] = []

  if (canPerformAppealSummonsAction(AppealSummonsAction.EDIT, summons, user)) {
    items.push({ title: 'Breyta', onClick: onEdit, icon: 'pencil' })
  }

  if (canPerformAppealSummonsAction(AppealSummonsAction.OPEN, summons, user)) {
    items.push({ title: 'Opna í nýjum flipa', onClick: onOpen, icon: 'open' })
  }

  return items
}
