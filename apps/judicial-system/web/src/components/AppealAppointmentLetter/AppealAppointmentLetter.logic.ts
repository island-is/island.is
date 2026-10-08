import { isCourtOfAppealsUser } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type {
  AppealCase,
  CivilClaimant,
  Defendant,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'

export interface AppealAppointmentLetterRow {
  /** Stable across renders: the party the letter appoints an advocate for. */
  key: string
  name: string
  /** The path segments the pdf route is addressed by, after the pdf type. */
  elementId: string[]
}

/**
 * Whether a verdict appeal currently stands. The association row persists
 * after withdrawal (and is reused if someone re-appeals within the deadline),
 * so a present `verdictAppealCase` alone is not enough. The route that serves
 * the letter applies the same rule.
 */
export const hasStandingVerdictAppeal = (
  verdictAppealCase?: Pick<AppealCase, 'appealState'> | null,
): boolean =>
  Boolean(verdictAppealCase) &&
  verdictAppealCase?.appealState !== AppealCaseState.WITHDRAWN

const letterRow = (
  party: 'defendant' | 'civilClaimant',
  partyId: string,
  advocateName: string,
): AppealAppointmentLetterRow => {
  const name = `Skipunarbréf ${advocateName}.pdf`

  return { key: `${party}-${partyId}`, name, elementId: [party, partyId, name] }
}

/**
 * The letter of appointment for one party, or nothing when there is none to
 * offer.
 *
 * Only the court of appeals sees it: it writes the letter and sends it, and
 * the advocate it appoints is told by e-mail rather than from a screen.
 *
 * Only the advocate in force has a letter. Replacing one supersedes it, and
 * nothing keeps the ones before, so a row is offered for exactly the
 * appointment the letter would reproduce.
 *
 * A defendant who waived a defender has none - the court confirms the answer,
 * which clears the name, and an appointment with nobody appointed is not one.
 *
 * A civil claimant who engaged a lawyer of their own has none either: a
 * réttargæslumaður is appointed by the court, a lögmaður is hired by the
 * claimant, and the court does not appoint what it did not choose.
 *
 * Shared by the two screens that offer it - the appeal overview and the
 * advocate screen - so the rule cannot drift between them, and so neither can
 * drift from the route, which refuses on the same grounds.
 */
export const getAppealAppointmentLetter = (
  workingCase: Pick<WorkingCase, 'verdictAppealCase'>,
  user: User | undefined,
  party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
): AppealAppointmentLetterRow | undefined => {
  if (
    !isCourtOfAppealsUser(user) ||
    !hasStandingVerdictAppeal(workingCase.verdictAppealCase)
  ) {
    return undefined
  }

  const { defendant, civilClaimant } = party

  if (defendant) {
    return defendant.isAppealDefenderConfirmed && defendant.appealDefenderName
      ? letterRow('defendant', defendant.id, defendant.appealDefenderName)
      : undefined
  }

  if (civilClaimant) {
    return civilClaimant.isAppealSpokespersonConfirmed &&
      !civilClaimant.appealSpokespersonIsLawyer &&
      civilClaimant.appealSpokespersonName
      ? letterRow(
          'civilClaimant',
          civilClaimant.id,
          civilClaimant.appealSpokespersonName,
        )
      : undefined
  }

  return undefined
}

/** Every letter of appointment that currently stands, in party order. */
export const getAppealAppointmentLetters = (
  workingCase: WorkingCase,
  user: User | undefined,
): AppealAppointmentLetterRow[] =>
  [
    ...(workingCase.defendants ?? []).map((defendant) =>
      getAppealAppointmentLetter(workingCase, user, { defendant }),
    ),
    ...(workingCase.civilClaimants ?? []).map((civilClaimant) =>
      getAppealAppointmentLetter(workingCase, user, { civilClaimant }),
    ),
  ].filter((row): row is AppealAppointmentLetterRow => Boolean(row))
