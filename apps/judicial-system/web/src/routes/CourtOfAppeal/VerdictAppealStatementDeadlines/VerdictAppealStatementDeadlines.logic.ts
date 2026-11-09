import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'

import { COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  type AppealStatementParty,
  findAppealStatementDeadline,
  hasFiledAppealStatement,
  isSameAppealStatementParty,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { AppealStatementDeadline } from '@island.is/judicial-system-web/src/graphql/schema'

export type StatementDeadlineRole =
  | 'DEFENDANT'
  | 'PROSECUTION'
  | 'CIVIL_CLAIMANT'

/**
 * One party of the appeal as the screen lists it: who they are, which row
 * in the appeal is theirs, where their statement stands and the deadline the
 * court has given them, if any.
 */
export interface StatementDeadlineParty {
  key: string
  role: StatementDeadlineRole
  roleLabel: string
  name: string
  // How the backend names the party: a defendant id, a civil claimant id,
  // or neither for the prosecution.
  ids: AppealStatementParty
  deadline?: string
  hasFiledStatement: boolean
}

const roleLabels: Record<StatementDeadlineRole, string> = {
  DEFENDANT: 'Ákærði',
  PROSECUTION: 'Ákæruvaldið',
  CIVIL_CLAIMANT: 'Bótakröfuhafi',
}

/**
 * Every party the court can give a deadline, in the order of the design: the
 * accused, then the prosecution, then the claimants.
 *
 * Every defendant and civil claimant of the case is listed, whether or not
 * the appeal concerns them (owner's decision), and a party without an
 * advocate or an appeal prosecutor is listed too: the court may still set
 * its deadline, there is just nobody to mail.
 */
export const getStatementDeadlineParties = (
  theCase: Pick<
    WorkingCase,
    'defendants' | 'civilClaimants' | 'appealProsecutor' | 'verdictAppealCase'
  >,
): StatementDeadlineParty[] => {
  const deadlines = theCase.verdictAppealCase?.statementDeadlines
  const eventLogs = theCase.verdictAppealCase?.appealEventLogs

  const describe = (
    key: string,
    role: StatementDeadlineRole,
    name: string | null | undefined,
    ids: AppealStatementParty,
  ): StatementDeadlineParty => ({
    key,
    role,
    roleLabel: roleLabels[role],
    name: name ?? '',
    ids,
    deadline:
      findAppealStatementDeadline(deadlines, ids)?.deadline ?? undefined,
    hasFiledStatement: hasFiledAppealStatement(eventLogs, ids),
  })

  return [
    ...(theCase.defendants ?? []).map((defendant) =>
      describe(`defendant-${defendant.id}`, 'DEFENDANT', defendant.name, {
        defendantId: defendant.id,
      }),
    ),
    describe('prosecution', 'PROSECUTION', theCase.appealProsecutor?.name, {}),
    ...(theCase.civilClaimants ?? []).map((civilClaimant) =>
      describe(
        `civil-claimant-${civilClaimant.id}`,
        'CIVIL_CLAIMANT',
        civilClaimant.name,
        { civilClaimantId: civilClaimant.id },
      ),
    ),
  ]
}

// The line above the party's name: its role, and whether its statement is in.
export const getStatementDeadlineStatusLabel = (
  party: Pick<StatementDeadlineParty, 'roleLabel' | 'hasFiledStatement'>,
): string =>
  `${party.roleLabel} - ${
    party.hasFiledStatement ? 'Greinargerð skilað' : 'Greinargerð ekki skilað'
  }`

// A first deadline is sent; one that stands is extended.
export const getStatementDeadlineActionLabel = (
  party: Pick<StatementDeadlineParty, 'deadline'>,
): string => (party.deadline ? 'Framlengja frest' : 'Senda frest')

/**
 * Whether the date the court has picked can be sent for the party.
 *
 * Nothing can be sent once the statement is in, and an extension has to move
 * the deadline later - the same rules the backend enforces, so the button
 * never offers what the request would refuse.
 */
export const canSendStatementDeadline = (
  party: Pick<StatementDeadlineParty, 'deadline' | 'hasFiledStatement'>,
  pickedDate: Date | undefined,
): boolean =>
  Boolean(
    !party.hasFiledStatement &&
      pickedDate &&
      (!party.deadline ||
        pickedDate.getTime() > new Date(party.deadline).getTime()),
  )

/**
 * The earliest day the picker offers: today, or the day after the deadline
 * that stands, so the rule an extension follows is visible in the calendar
 * rather than only in a button that will not light up.
 */
export const getStatementDeadlineMinDate = (
  party: Pick<StatementDeadlineParty, 'deadline'>,
  today: Date = new Date(),
): Date => {
  const earliest = startOfDay(today)

  if (!party.deadline) {
    return earliest
  }

  const dayAfterDeadline = startOfDay(addDays(new Date(party.deadline), 1))

  return dayAfterDeadline > earliest ? dayAfterDeadline : earliest
}

/**
 * What the court confirms before the deadline goes out. The claimant and the
 * accused are named; the prosecution is a side, not a person, so it is not.
 *
 * The intro stands on its own; the deadline and the notice follow it as one
 * block, which is how the dialog sets them.
 */
export const getStatementDeadlineConfirmation = (
  party: Pick<
    StatementDeadlineParty,
    'role' | 'roleLabel' | 'name' | 'deadline'
  >,
  pickedDate: Date,
): { title: string; intro: string; details: string[] } => {
  const isExtension = Boolean(party.deadline)
  const subject =
    party.role === 'PROSECUTION'
      ? party.roleLabel
      : `${party.roleLabel} ${party.name}`.trim()

  return {
    title: isExtension
      ? 'Viltu framlengja greinargerðarfrest?'
      : 'Viltu senda út greinargerðarfrest?',
    intro: `${subject} fær ${
      isExtension ? 'aukinn frest' : 'frest'
    } til að senda inn greinargerð.`,
    details: [
      `Frestur til: ${formatDate(pickedDate, 'PPP')}.`,
      'Aðilar máls fá tilkynningu um frestinn.',
    ],
  }
}

/**
 * Where the court uploads the party's statement on its behalf. The appeal id
 * keeps the page about this appeal, as every step's link does; the party is
 * named the way the deadline rows name it, and the prosecution by naming
 * nobody.
 */
export const getStatementUploadUrl = (
  caseId: string,
  appealCaseId: string,
  party: Pick<StatementDeadlineParty, 'ids'>,
): string => {
  const query = new URLSearchParams({ appealCaseId })

  if (party.ids.defendantId) {
    query.set('defendantId', party.ids.defendantId)
  } else if (party.ids.civilClaimantId) {
    query.set('civilClaimantId', party.ids.civilClaimantId)
  }

  return `${COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_ROUTE}/${caseId}?${query}`
}

/**
 * The working case with a saved deadline written in, so the screen is right
 * without a refetch: the party's row is replaced if it had one, added if not.
 */
export const applyStatementDeadline = (
  theCase: WorkingCase,
  saved: AppealStatementDeadline,
): WorkingCase => {
  if (!theCase.verdictAppealCase) {
    return theCase
  }

  const current = theCase.verdictAppealCase.statementDeadlines ?? []
  const replaced = current.some((deadline) =>
    isSameAppealStatementParty(deadline, saved),
  )

  return {
    ...theCase,
    verdictAppealCase: {
      ...theCase.verdictAppealCase,
      statementDeadlines: replaced
        ? current.map((deadline) =>
            isSameAppealStatementParty(deadline, saved) ? saved : deadline,
          )
        : [...current, saved],
    },
  }
}
