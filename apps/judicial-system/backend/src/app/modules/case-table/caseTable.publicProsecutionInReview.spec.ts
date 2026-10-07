import type { User } from '@island.is/judicial-system/types'
import {
  caseTables,
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { captureSql, initCaseTableModels } from './caseTable.sqlProbe'
import { getGlobalIncludes } from './caseTable.utils'
import { caseTableWhereOptions } from './caseTable.whereOptions'

/**
 * The review list carries a result column, and what that column can say is
 * bounded by what the list admits rather than by the generator.
 *
 * `indictmentRulingDecision` renders a second tag beside the decision when the
 * case was dismissed, and the deadline column beside it computes a different
 * appeal window for a fine than for a judgment. Both are sound here only
 * because the access rule narrows the list to fines and judgments. That
 * narrowing lives two modules away from the column list, so widening it later
 * would change what this list renders without anything in the types lib
 * noticing - which is what this spec is here to stop.
 */
describe('public prosecution review list', () => {
  const publicProsecutionUser = {
    id: 'public_prosecutor_id',
    role: UserRole.PROSECUTOR,
    institution: {
      id: 'public_prosecutors_office_id',
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  } as User

  beforeAll(initCaseTableModels)

  const sqlForTable = (tableType: CaseTableType, user: User) => {
    // Built before captureSql installs its stub, so a throw here cannot leave
    // the query layer stubbed for the rest of the file.
    const whereOptions = caseTableWhereOptions[tableType](user)
    const [include, order] = getGlobalIncludes(
      whereOptions.includes ?? {},
      user,
    )

    return captureSql(() =>
      repository.Case.findAll({
        attributes: ['id'],
        include,
        where: whereOptions.where,
        order,
      }),
    )
  }

  it('shows the result of the review', () => {
    expect(
      caseTables[CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW]
        .columnKeys,
    ).toContain('indictmentRulingDecision')
  })

  // The bound that makes the column above safe. A dismissal reaching this list
  // would render "Frávísun" plus an appeal state tag in a cell the design
  // specified as one tag, beside a deadline computed for the wrong window.
  it('admits only fines and judgments, so the result column cannot read anything else', async () => {
    const sql = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW,
      publicProsecutionUser,
    )

    // Matched whole, closing paren included. `IN ('FINE', 'RULING'` on its own
    // still matches a list widened to a third decision, which is the very
    // regression this guards - so the obvious loosening silently empties it.
    // The element order is load-bearing too: the office and prison admin rules
    // render the same two values as ('RULING', 'FINE'), so this also catches
    // the list being wired to the wrong access rule.
    expect(sql).toContain(
      `"Case"."indictment_ruling_decision" IN ('FINE', 'RULING')`,
    )
  })
})
