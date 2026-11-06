import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  isCourtOfAppealsUser,
  isDefenceUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
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
  /** The file as it downloads, and how a list of files names it. */
  fileName: string
  /** How the advocate screen labels the button, per the design. */
  buttonLabel: string
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
  const fileName = `Skipunarbréf ${advocateName}.pdf`

  return {
    key: `${party}-${partyId}`,
    fileName,
    buttonLabel: `Skipunarbréf ${advocateName} - PDF`,
    elementId: [party, partyId, fileName],
  }
}

/**
 * Whether this user is shown a party's letter at all.
 *
 * The court of appeals writes it and the public prosecution office is copied
 * on it, so both see every letter on the case. A defence user sees the letter
 * of the party they act for - the one the district court confirmed them for,
 * which is the same test every other party document on the case applies -
 * and no other: a defender of one of the accused is not party to what the
 * court sent the other's. Nobody else is offered it.
 *
 * The limited access route refuses on the same grounds, so a row offered
 * here is one that opens.
 */
export const canViewAppealAppointmentLetter = (
  user: User | undefined,
  party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
): boolean => {
  if (isCourtOfAppealsUser(user) || isPublicProsecutionOfficeUser(user)) {
    return true
  }

  if (!isDefenceUser(user) || !user?.nationalId) {
    return false
  }

  const ownIds = normalizeAndFormatNationalId(user.nationalId)
  const { defendant, civilClaimant } = party

  if (defendant) {
    return Boolean(
      defendant.isDefenderChoiceConfirmed &&
        defendant.defenderNationalId &&
        ownIds.includes(defendant.defenderNationalId),
    )
  }

  if (civilClaimant) {
    return Boolean(
      civilClaimant.hasSpokesperson &&
        civilClaimant.isSpokespersonConfirmed &&
        civilClaimant.spokespersonNationalId &&
        ownIds.includes(civilClaimant.spokespersonNationalId),
    )
  }

  return false
}

/**
 * The letter of appointment for one party, or nothing when there is none to
 * offer - see canViewAppealAppointmentLetter for who is offered it.
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
 * Shared by every screen that offers it - the court of appeals' overview and
 * advocate screen, and the appeal section the parties see - so the rule
 * cannot drift between them, and so none can drift from the routes, which
 * refuse on the same grounds.
 */
export const getAppealAppointmentLetter = (
  workingCase: Pick<WorkingCase, 'verdictAppealCase'>,
  user: User | undefined,
  party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
): AppealAppointmentLetterRow | undefined => {
  if (
    !canViewAppealAppointmentLetter(user, party) ||
    !hasStandingVerdictAppeal(workingCase.verdictAppealCase)
  ) {
    return undefined
  }

  const { defendant, civilClaimant } = party

  if (defendant) {
    // The waiver is its own field, and the API takes it without touching the
    // defender's name or the confirmation. A defendant who asked for no
    // defender can therefore still carry a confirmed, named one - and there is
    // nobody to appoint.
    return defendant.isAppealDefenderConfirmed &&
      !defendant.isAppealDefenderWaived &&
      defendant.appealDefenderName
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
