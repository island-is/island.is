import {
  isCourtOfAppealsUser,
  isPublicProsecutionOfficeUser,
  verdictAppealDeclarationFileCategories,
} from '@island.is/judicial-system/types'
import {
  type AppealCase,
  AppealCaseState,
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

export interface AppealAppointmentLetterRow {
  /** Stable across renders: the party the letter appoints an advocate for. */
  key: string
  name: string
  /** The path segments the pdf route is addressed by, after the pdf type. */
  elementId: string[]
}

const appointmentLetterRow = (
  party: 'defendant' | 'civilClaimant',
  partyId: string,
  advocateName: string,
): AppealAppointmentLetterRow => {
  const name = `Skipunarbréf ${advocateName}.pdf`

  return { key: `${party}-${partyId}`, name, elementId: [party, partyId, name] }
}

/**
 * The letters of appointment that currently stand - one per party whose
 * advocate the court of appeals has confirmed.
 *
 * Only the court of appeals sees them: it writes the letter and sends it, and
 * the advocate it appoints is told by e-mail rather than from this screen.
 *
 * Only the advocate in force has a letter. Replacing one supersedes it, and
 * nothing keeps the ones before, so a row is offered for exactly the
 * appointment the letter would reproduce.
 *
 * A civil claimant who engaged a lawyer of their own gets no row: a
 * réttargæslumaður is appointed by the court, a lögmaður is hired by the
 * claimant, and the court does not appoint what it did not choose.
 */
export const getAppealAppointmentLetters = (
  workingCase: Case,
  user: User | undefined,
): AppealAppointmentLetterRow[] => {
  if (
    !isCourtOfAppealsUser(user) ||
    !hasStandingVerdictAppeal(workingCase.verdictAppealCase)
  ) {
    return []
  }

  const defenderLetters = (workingCase.defendants ?? []).flatMap((defendant) =>
    defendant.isAppealDefenderConfirmed && defendant.appealDefenderName
      ? [
          appointmentLetterRow(
            'defendant',
            defendant.id,
            defendant.appealDefenderName,
          ),
        ]
      : [],
  )

  const spokespersonLetters = (workingCase.civilClaimants ?? []).flatMap(
    (civilClaimant) =>
      civilClaimant.isAppealSpokespersonConfirmed &&
      !civilClaimant.appealSpokespersonIsLawyer &&
      civilClaimant.appealSpokespersonName
        ? [
            appointmentLetterRow(
              'civilClaimant',
              civilClaimant.id,
              civilClaimant.appealSpokespersonName,
            ),
          ]
        : [],
  )

  return [...defenderLetters, ...spokespersonLetters]
}

export const showsAppealSummonses = (
  workingCase: Pick<Case, 'verdictAppealCase'>,
  user: User | undefined,
): boolean =>
  isPublicProsecutionOfficeUser(user) &&
  hasStandingVerdictAppeal(workingCase.verdictAppealCase)
