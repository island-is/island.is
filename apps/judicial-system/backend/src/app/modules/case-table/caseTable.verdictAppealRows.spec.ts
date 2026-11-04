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
describe('verdict appeal rows', () => {
  const courtOfAppealsUser = {
    id: 'coa_user_id',
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    institution: { id: 'coa_id', type: InstitutionType.COURT_OF_APPEALS },
  } as User

  const publicProsecutionUser = {
    id: 'public_prosecutor_id',
    role: UserRole.PROSECUTOR,
    institution: {
      id: 'public_prosecutors_office_id',
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  } as User

  // Every list of appealed verdicts, with a user who has it. The public
  // prosecution's is a list of verdict appeals as much as the court's are: a
  // fine is appealed by ruling appeal and its where options keep those out.
  const verdictAppealTables: [CaseTableType, User][] = [
    [
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
      courtOfAppealsUser,
    ],
    [
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
      courtOfAppealsUser,
    ],
    [
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
      publicProsecutionUser,
    ],
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

  const displayed = (tableType: CaseTableType, user: User) => {
    const { displayCases } = caseTableWhereOptions[tableType](user)

    if (!displayCases) {
      throw new Error(`${tableType} has no displayCases`)
    }

    return displayCases([caseWithBothAppeals()])
  }

  // The case carries a ruling appeal too, so a row that took the case-level
  // appeal would name the wrong proceeding on every row of these lists.
  it.each(verdictAppealTables)(
    'presents the verdict appeal as the appeal of a %s row',
    (tableType, user) => {
      const [row] = displayed(tableType, user)

      expect(row.appeal?.id).toBe('verdict-appeal')
    },
  )

  // A row carries one appeal under one name, whichever association the list
  // fetched it from - see CaseTableRowCase. The source associations are not
  // part of a row at all, which is what stops a column reaching past the
  // list's choice.
  it.each(verdictAppealTables)(
    'leaves no source association on a %s row',
    (t, user) => {
      const [row] = displayed(t, user) as unknown as Record<string, unknown>[]

      expect(row.verdictAppealCase).toBeUndefined()
      expect(row.appealCase).toBeUndefined()
    },
  )

  it.each(verdictAppealTables)('leaves %s with one row per case', (t, user) => {
    expect(displayed(t, user)).toHaveLength(1)
  })
})
