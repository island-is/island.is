import { isSameAppealStatementParty } from '@island.is/judicial-system/types'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'

import type { StatementDeadlineParty } from '../VerdictAppealStatementDeadlines/VerdictAppealStatementDeadlines.logic'
import { getStatementDeadlineParties } from '../VerdictAppealStatementDeadlines/VerdictAppealStatementDeadlines.logic'

// How the deadlines page names the party in the query: a defendant, a civil
// claimant, or the prosecution when it names neither.
export interface StatementUploadQuery {
  defendantId?: string | string[]
  civilClaimantId?: string | string[]
}

const single = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

/**
 * The party the page is about, resolved from the query the way the deadlines
 * page lists the parties, so both agree on who there is to file for.
 *
 * Undefined when the query names nobody the case has, or a party whose
 * statement is already in: the backend refuses a second statement, so the
 * page has nothing to offer and says so instead.
 */
export const getStatementUploadParty = (
  theCase: Parameters<typeof getStatementDeadlineParties>[0],
  query: StatementUploadQuery,
): StatementDeadlineParty | undefined => {
  const wanted = {
    defendantId: single(query.defendantId),
    civilClaimantId: single(query.civilClaimantId),
  }

  const party = getStatementDeadlineParties(theCase).find((candidate) =>
    isSameAppealStatementParty(candidate.ids, wanted),
  )

  return party && !party.hasFiledStatement ? party : undefined
}

/**
 * Which categories the party's statement and its attachments are filed
 * under. A civil claimant's go with the defendant's, told apart by the party
 * id on the file, as the ruling appeal's statement categories are.
 */
export const getStatementFileCategories = (
  party: Pick<StatementDeadlineParty, 'role'>,
): { statement: CaseFileCategory; caseFile: CaseFileCategory } =>
  party.role === 'PROSECUTION'
    ? {
        statement: CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT,
        caseFile:
          CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT_CASE_FILE,
      }
    : {
        statement: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
        caseFile: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
      }

/**
 * Whether the file is one of the party's in the category. Both are checked:
 * the defendant categories are shared by every defendant and claimant of
 * the case, so the category alone would show one party another's statement.
 */
export const isPartyStatementFile = (
  file: {
    category?: CaseFileCategory | null
    defendantId?: string | null
    civilClaimantId?: string | null
  },
  category: CaseFileCategory,
  party: Pick<StatementDeadlineParty, 'ids'>,
): boolean =>
  file.category === category && isSameAppealStatementParty(file, party.ids)

// The line under the case number naming whose statement this is: the role,
// and the name after it when there is one.
export const getStatementUploadHeaderLine = (
  party: Pick<StatementDeadlineParty, 'roleLabel' | 'name'>,
): string => `${party.roleLabel} ${party.name}`.trim()
