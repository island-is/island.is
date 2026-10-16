import type { User } from '@island.is/judicial-system/types'
import {
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'
import { caseTableWhereOptions } from './caseTable.whereOptions'

/**
 * A row is about one appeal, and everything downstream asks `appealCase` which
 * one: the id the row carries, the context menu, the page the row opens.
 *
 * On a verdict appeal list that appeal is the verdict appeal, so the list puts
 * it there - and takes the old name away - rather than every reader having to
 * know which lists are verdict lists. This is the same move
 * `expandCasesWithAppeals` makes for ruling order appeals.
 */
describe('court of appeals verdict appeal rows', () => {
  const courtOfAppealsUser = {
    id: 'coa_user_id',
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    institution: { id: 'coa_id', type: InstitutionType.COURT_OF_APPEALS },
  } as User

  const verdictAppealTables = [
    CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
    CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
  ]

  const caseWithBothAppeals = () =>
    ({
      id: 'case-id',
      appealCase: { id: 'ruling-appeal' },
      verdictAppealCase: { id: 'verdict-appeal' },
      toJSON() {
        return {
          id: 'case-id',
          appealCase: { id: 'ruling-appeal' },
          verdictAppealCase: { id: 'verdict-appeal' },
        }
      },
    } as unknown as Case)

  const displayed = (tableType: CaseTableType) => {
    const { displayCases } =
      caseTableWhereOptions[tableType](courtOfAppealsUser)

    if (!displayCases) {
      throw new Error(`${tableType} has no displayCases`)
    }

    return displayCases([caseWithBothAppeals()])
  }

  // The case carries a ruling appeal too, so a row that took the case-level
  // appeal would name the wrong proceeding on every row of these lists.
  it.each(verdictAppealTables)(
    'presents the verdict appeal as the appeal of a %s row',
    (tableType) => {
      const [row] = displayed(tableType)

      expect(row.appeal?.id).toBe('verdict-appeal')
    },
  )

  // A row carries one appeal under one name, whichever association the list
  // fetched it from - see CaseTableRowCase. The source associations are not
  // part of a row at all, which is what stops a column reaching past the
  // list's choice.
  it.each(verdictAppealTables)(
    'leaves no source association on a %s row',
    (t) => {
      const [row] = displayed(t) as unknown as Record<string, unknown>[]

      expect(row.verdictAppealCase).toBeUndefined()
      expect(row.appealCase).toBeUndefined()
    },
  )

  it.each(verdictAppealTables)('leaves %s with one row per case', (t) => {
    expect(displayed(t)).toHaveLength(1)
  })
})
