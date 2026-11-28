import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseState,
  caseTables,
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import { captureSql, initCaseTableModels } from './caseTable.sqlProbe'
import { type CaseTableRowCase, toDisplayCases } from './caseTable.types'
import {
  getAllIncludes,
  getAttributes,
  getGlobalIncludes,
} from './caseTable.utils'
import { caseTableWhereOptions } from './caseTable.whereOptions'

/**
 * A case comes back to the public prosecution office once the court of appeals
 * has completed the verdict appeal.
 *
 * It goes straight to the review list, for every defendant of the case, and is
 * told apart there by the court of appeals' case number. Which list a case is
 * in is decided in SQL the where options only hint at, so that is asserted on
 * the SQL; which rows carry the court of appeals' number is decided when the
 * rows are built, and is asserted on the rows.
 */
describe('public prosecution office lists after a verdict appeal', () => {
  const officeUser = {
    id: 'office_user_id',
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    institution: {
      id: 'public_prosecutors_office_id',
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  } as User

  beforeAll(initCaseTableModels)

  const flat = (sql: string) => sql.replace(/\s+/g, ' ')

  const membershipSql = async (tableType: CaseTableType) => {
    const whereOptions = caseTableWhereOptions[tableType](officeUser)
    const [include, order] = getGlobalIncludes(
      whereOptions.includes ?? {},
      officeUser,
    )

    return flat(
      await captureSql(() =>
        repository.Case.findAll({
          attributes: ['id'],
          include,
          where: whereOptions.where,
          order,
        }),
      ),
    )
  }

  const rowSql = async (tableType: CaseTableType) => {
    const columnKeys = caseTables[tableType].columnKeys
    const whereOptions = caseTableWhereOptions[tableType](officeUser)
    const [include, order] = getAllIncludes(
      whereOptions.includes ?? {},
      columnKeys,
      officeUser,
    )

    return flat(
      await captureSql(() =>
        repository.Case.findAll({
          attributes: getAttributes(columnKeys, officeUser),
          include,
          where: whereOptions.where,
          order,
        }),
      ),
    )
  }

  const completedVerdictAppeal = `EXISTS ( SELECT 1 FROM "appeal_case" ac WHERE ac."case_id" = "Case"."id" AND ac."appeal_type" = 'VERDICT' AND ac."appeal_state" = 'COMPLETED' )`

  describe('the review list', () => {
    // A case has a reviewer before it can go to the court of appeals, so the
    // case level asks for nothing more than it did: the completed appeal only
    // widens which defendants get a row.
    it('still asks only for a reviewer at the case level', async () => {
      const sql = await membershipSql(
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW,
      )

      expect(sql).toContain('"Case"."indictment_reviewer_id" IS NOT NULL')
      expect(sql.split('"appeal_case"')).toHaveLength(2)
    })

    // The defendants join decides which rows the case gets. A defendant
    // awaiting the district court review qualifies as before; a completed
    // verdict appeal qualifies every defendant, decided or not, closed or not.
    it('lists every defendant of a case with a completed verdict appeal', async () => {
      const sql = await membershipSql(
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW,
      )

      expect(sql).toContain(
        `(("defendants"."indictment_review_decision" IS NULL AND "defendants"."is_closed_without_enforcement" IS NOT true) OR ${completedVerdictAppeal} )`,
      )
    })

    // The membership query says everything it needs with the correlated
    // condition; the join belongs to the column that reads the appeal.
    it('joins the verdict appeal for the case number column only', async () => {
      expect(
        await membershipSql(
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW,
        ),
      ).not.toContain('"verdictAppealCase"')

      const sql = await rowSql(
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW,
      )

      expect(sql).toContain(
        `LEFT OUTER JOIN "appeal_case" AS "verdictAppealCase" ON "Case"."id" = "verdictAppealCase"."case_id" AND "verdictAppealCase"."appeal_type" = 'VERDICT'`,
      )
      expect(sql).toContain('"verdictAppealCase"."appeal_case_number"')
      // The row decides from the state whether the appeal is completed.
      expect(sql).toContain('"verdictAppealCase"."appeal_state"')
    })

    it('shows the case number that carries the court of appeals number', () => {
      expect(
        caseTables[
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW
        ].columnKeys[0],
      ).toBe('caseNumberAfterVerdictAppeal')
    })
  })

  it('takes a case off the appealed list once its verdict appeal is completed', async () => {
    const sql = await membershipSql(
      CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED,
    )

    expect(sql).toContain(
      `"Case"."indictment_reviewer_id" IS NOT NULL AND NOT ${completedVerdictAppeal}`,
    )
  })

  // The other lists say nothing about a completed verdict appeal. The list of
  // new cases needs no rule: a returning case already has a reviewer. For the
  // rest, what moves a court of appeals verdict through them is not recorded
  // yet.
  it.each([
    CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_NEW,
    CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED,
    CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED,
    CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN,
    CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_ACQUITTED,
    CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REQUESTED_APPEAL,
    CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_CLOSED_WITHOUT_ENFORCEMENT,
  ])('leaves %s as it was', async (tableType) => {
    expect(await membershipSql(tableType)).not.toContain('"appeal_case"')
  })

  describe('rows', () => {
    const caseWith = (verdictAppealCase?: Record<string, unknown>) => {
      const defendants = [
        { id: 'defendant_1', eventLogs: [] },
        { id: 'defendant_2', eventLogs: [] },
      ]
      const json = {
        id: 'case_id',
        courtCaseNumber: 'S-222/2021',
        policeCaseNumbers: ['007-2020-56798'],
        court: { name: 'Héraðsdómur Reykjavíkur' },
        defendants,
        verdictAppealCase,
      }

      return {
        ...json,
        verdictAppealCase: verdictAppealCase && {
          ...verdictAppealCase,
          toJSON: () => verdictAppealCase,
        },
        toJSON: () => json,
      } as unknown as repository.Case
    }

    // Through the list's own displayCases, as the service builds rows: the
    // number depends on the list naming the expander that carries the appeal.
    const inReviewRows = (theCase: repository.Case) =>
      toDisplayCases(
        [theCase],
        caseTableWhereOptions[
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW
        ](officeUser).displayCases,
      )

    const caseNumberCell = (row: CaseTableRowCase) =>
      caseTableCellGenerators.caseNumberAfterVerdictAppeal.generate(
        row,
        officeUser,
      ).value

    it('gives every defendant a row that carries the completed verdict appeal', () => {
      const rows = inReviewRows(
        caseWith({
          id: 'verdict_appeal_id',
          appealCaseNumber: '555/2026',
          appealState: AppealCaseState.COMPLETED,
        }),
      )

      expect(rows.map((row) => row.defendants?.map((d) => d.id))).toEqual([
        ['defendant_1'],
        ['defendant_2'],
      ])

      for (const row of rows) {
        expect(caseNumberCell(row)).toEqual(
          expect.objectContaining({
            strList: ['555/2026', 'HDR: S-222/2021', '007-2020-56798'],
          }),
        )
        // The row is about the case, not the appeal: it must open the case and
        // offer no appeal action, which is what an appeal id on the row means.
        expect(row.appeal).toBeUndefined()
      }
    })

    // A defendant still in review while a co-defendant's appeal is before the
    // court: the appeal has a number, and the row must not be labelled with it.
    // Nor may an appeal the court has confirmed but not yet completed - its
    // outcome is not out, and the number on the row would give that away.
    it.each([
      AppealCaseState.APPEALED,
      AppealCaseState.RECEIVED,
      AppealCaseState.READY_TO_COMPLETE,
      AppealCaseState.WITHDRAWN,
      undefined,
    ])(
      'shows no court of appeals number for an appeal in state %s',
      (appealState) => {
        const rows = inReviewRows(
          caseWith({
            id: 'verdict_appeal_id',
            appealCaseNumber: '555/2026',
            appealState,
          }),
        )

        expect(rows).toHaveLength(2)

        for (const row of rows) {
          expect(row.completedVerdictAppeal).toBeUndefined()
          expect(caseNumberCell(row)).toEqual(
            expect.objectContaining({
              strList: ['', 'HDR: S-222/2021', '007-2020-56798'],
            }),
          )
        }
      },
    )

    it('shows no court of appeals number for a case without a verdict appeal', () => {
      const rows = inReviewRows(caseWith())

      expect(rows).toHaveLength(2)

      for (const row of rows) {
        expect(caseNumberCell(row)).toEqual(
          expect.objectContaining({
            strList: ['', 'HDR: S-222/2021', '007-2020-56798'],
          }),
        )
      }
    })
  })
})
