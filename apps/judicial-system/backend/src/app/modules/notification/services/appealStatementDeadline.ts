import { formatDate } from '@island.is/judicial-system/formatters'
import {
  type AppealStatementParty,
  isSameAppealStatementParty,
} from '@island.is/judicial-system/types'

// Imported from the module that owns it rather than the formatters barrel,
// for the reason the advocate mail gives: the placeholder is a decision about
// the appeal case number, shared with the letter of appointment.
import { getAppealCaseNumberOrPlaceholder } from '../../../formatters/generatedPdfs/appealAppointmentLetterPdf'
import type { Case } from '../../repository'
import { COURT_OF_APPEALS_NAME } from './appealAdvocateAssigned'

/**
 * The mails that follow the court of appeals giving a party of a verdict
 * appeal a deadline to file its statement, or more time for it.
 *
 * Two messages: the party's advocate is told it has the time, and everyone
 * else with a part in the appeal is told who got it, so each side knows
 * where the other stands. The wording is the product owner's, set vs
 * extended, and the court is named outright for the reason the advocate
 * mail gives: the case's court is the district court that gave the judgment.
 */
const COURT_NAME = COURT_OF_APPEALS_NAME

/** How the other parties' mail names the role of whoever got the deadline. */
export type AppealStatementDeadlineRole =
  | 'saksóknari'
  | 'verjandi'
  | 'réttargæslumaður'
  | 'lögmaður'

export interface AppealStatementDeadlineRecipient {
  // Every party the address speaks for. One lawyer often defends two of the
  // accused, and is written to once, as the advocate of them all.
  parties: AppealStatementParty[]
  role: AppealStatementDeadlineRole
  name?: string | null
  email: string
}

/**
 * Everyone with a part in the appeal who can be written to: the appeal
 * prosecutor, each defendant's confirmed defender and each claimant's
 * confirmed advocate. A party whose advocate the court has not confirmed, or
 * who has no address, is simply not on the list - the deadline stands for
 * them all the same.
 */
export const getAppealStatementDeadlineRecipients = (
  theCase: Pick<Case, 'appealProsecutor' | 'defendants' | 'civilClaimants'>,
): AppealStatementDeadlineRecipient[] => {
  // Keyed by address, so an advocate recorded on several parties is one
  // recipient speaking for them all. The first party's name and role stand.
  const recipients = new Map<string, AppealStatementDeadlineRecipient>()

  const add = (
    party: AppealStatementParty,
    recipient: Omit<AppealStatementDeadlineRecipient, 'parties'>,
  ) => {
    const key = recipient.email.trim().toLowerCase()
    const existing = recipients.get(key)

    if (existing) {
      existing.parties.push(party)
    } else {
      recipients.set(key, { ...recipient, parties: [party] })
    }
  }

  if (theCase.appealProsecutor?.email) {
    add(
      {},
      {
        role: 'saksóknari',
        name: theCase.appealProsecutor.name,
        email: theCase.appealProsecutor.email,
      },
    )
  }

  for (const defendant of theCase.defendants ?? []) {
    if (
      defendant.isAppealDefenderConfirmed &&
      !defendant.isAppealDefenderWaived &&
      defendant.appealDefenderEmail
    ) {
      add(
        { defendantId: defendant.id },
        {
          role: 'verjandi',
          name: defendant.appealDefenderName,
          email: defendant.appealDefenderEmail,
        },
      )
    }
  }

  for (const civilClaimant of theCase.civilClaimants ?? []) {
    // The screen clears the confirmation when the advocate is removed, but
    // nothing below it does, so a claimant the court has said has no
    // advocate is left out whatever the confirmation says.
    if (
      civilClaimant.hasAppealSpokesperson !== false &&
      civilClaimant.isAppealSpokespersonConfirmed &&
      civilClaimant.appealSpokespersonEmail
    ) {
      add(
        { civilClaimantId: civilClaimant.id },
        {
          role: civilClaimant.appealSpokespersonIsLawyer
            ? 'lögmaður'
            : 'réttargæslumaður',
          name: civilClaimant.appealSpokespersonName,
          email: civilClaimant.appealSpokespersonEmail,
        },
      )
    }
  }

  return Array.from(recipients.values())
}

// Whether the address speaks for the party.
export const representsAppealStatementParty = (
  recipient: Pick<AppealStatementDeadlineRecipient, 'parties'>,
  party: AppealStatementParty,
): boolean =>
  recipient.parties.some((candidate) =>
    isSameAppealStatementParty(candidate, party),
  )

/**
 * How the other parties' mail names who got the deadline: the advocate by
 * name and role, as the product owner wrote it ("Lára Lögmann verjandi"),
 * or, when the party has no advocate to name, the party itself.
 */
export const describeAppealStatementDeadlineParty = (
  theCase: Pick<Case, 'defendants' | 'civilClaimants'>,
  party: AppealStatementParty,
  recipients: AppealStatementDeadlineRecipient[],
): string => {
  const recipient = recipients.find((candidate) =>
    representsAppealStatementParty(candidate, party),
  )

  if (recipient?.name) {
    return `${recipient.name} ${recipient.role}`
  }

  if (party.defendantId) {
    const defendant = theCase.defendants?.find(
      (candidate) => candidate.id === party.defendantId,
    )

    return `Ákærði ${defendant?.name ?? ''}`.trim()
  }

  if (party.civilClaimantId) {
    const civilClaimant = theCase.civilClaimants?.find(
      (candidate) => candidate.id === party.civilClaimantId,
    )

    return `Bótakröfuhafi ${civilClaimant?.name ?? ''}`.trim()
  }

  return 'Ákæruvaldið'
}

export const appealStatementDeadlineSubject = (
  extended: boolean,
  appealCaseNumber?: string | null,
) =>
  `${COURT_NAME} - ${
    extended ? 'framlengdur greinargerðarfrestur' : 'greinargerðarfrestur'
  } í máli ${getAppealCaseNumberOrPlaceholder(appealCaseNumber)}`

// The closing line the product owner wrote, as a link to the case. Kept even
// where the reader cannot open the case yet (owner's decision).
const overviewLink = (link: string) =>
  `<a href="${link}">Sjá nánar á yfirlitssíðu málsins í Réttarvörslugátt.</a>`

interface BodyParams {
  extended: boolean
  appealCaseNumber?: string | null
  deadline: Date | string
  link: string
}

/** To the party that got the time. */
export const appealStatementDeadlineGrantedBody = ({
  extended,
  appealCaseNumber,
  deadline,
  link,
}: BodyParams) =>
  `${COURT_NAME} hefur veitt þér ${
    extended ? 'aukinn frest' : 'frest'
  } til að skila greinargerð vegna máls nr. ${getAppealCaseNumberOrPlaceholder(
    appealCaseNumber,
  )}.<br/>Frestur til ${formatDate(deadline, 'PPP')}.<br/><br/>${overviewLink(
    link,
  )}`

/** To everyone else, naming who got it. */
export const appealStatementDeadlineOthersBody = ({
  extended,
  appealCaseNumber,
  deadline,
  link,
  who,
}: BodyParams & { who: string }) =>
  `${who} hefur fengið ${
    extended ? 'aukinn frest' : 'frest'
  } til að skila greinargerð vegna máls nr. ${getAppealCaseNumberOrPlaceholder(
    appealCaseNumber,
  )}. Frestur til ${formatDate(deadline, 'PPP')}.<br/><br/>${overviewLink(
    link,
  )}`
