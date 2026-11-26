import {
  CaseState,
  CaseType,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import {
  captureSql,
  initCaseTableModels,
} from '../../case-table/caseTable.sqlProbe'
import { Case } from '../models/case.model'
import {
  archivableCaseWhere,
  getRegularArchiveDate,
} from '../types/caseRepository.types'

describe('archivable cases', () => {
  describe('archivableCaseWhere', () => {
    let sql: string

    beforeAll(async () => {
      initCaseTableModels()

      sql = await captureSql(() => Case.findOne({ where: archivableCaseWhere }))
    })

    it('should only consider cases that are not archived yet', () => {
      expect(sql).toContain('"Case"."is_archived" = false')
    })

    it('should leave a case alone until its lifetime extension has passed', () => {
      expect(sql).toContain(
        '("Case"."archive_not_before" IS NULL OR "Case"."archive_not_before" < current_timestamp)',
      )
    })

    it('should require the extension together with the regular lifetime rules', () => {
      // The extension is one of the top level conditions, all of which have to
      // hold, so it can postpone archiving and never bring it forward
      expect(sql).toMatch(
        /"is_archived" = false AND \("Case"\."archive_not_before" IS NULL OR [^)]*\) AND \(/,
      )
    })
  })

  describe('getRegularArchiveDate', () => {
    const created = new Date('2026-01-10T12:00:00.000Z')
    const rulingDate = new Date('2026-02-10T12:00:00.000Z')
    const validToDate = new Date('2026-03-10T12:00:00.000Z')
    const dates = { created, rulingDate, validToDate }

    // The start of the day after the ninetieth day
    const ninetyDaysAfter = (date: Date) =>
      new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 91,
        ),
      )

    it('should be the start of the first day the case is archived on', () => {
      expect(
        getRegularArchiveDate({
          type: CaseType.CUSTODY,
          state: CaseState.DRAFT,
          ...dates,
        }),
      ).toEqual(new Date('2026-04-11T00:00:00.000Z'))
    })

    it.each([
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
    ])('should count from creation for a %s request case', (state) => {
      for (const type of [...restrictionCases, ...investigationCases]) {
        expect(getRegularArchiveDate({ type, state, ...dates })).toEqual(
          ninetyDaysAfter(created),
        )
      }
    })

    it.each([CaseState.REJECTED, CaseState.DISMISSED])(
      'should count from the ruling for a %s request case',
      (state) => {
        for (const type of [...restrictionCases, ...investigationCases]) {
          expect(getRegularArchiveDate({ type, state, ...dates })).toEqual(
            ninetyDaysAfter(rulingDate),
          )
        }
      },
    )

    it('should count from the end of the restriction for an accepted restriction case', () => {
      for (const type of restrictionCases) {
        expect(
          getRegularArchiveDate({ type, state: CaseState.ACCEPTED, ...dates }),
        ).toEqual(ninetyDaysAfter(validToDate))
      }
    })

    it('should count from the ruling for an accepted investigation case', () => {
      for (const type of investigationCases) {
        expect(
          getRegularArchiveDate({ type, state: CaseState.ACCEPTED, ...dates }),
        ).toEqual(ninetyDaysAfter(rulingDate))
      }
    })

    it('should have no regular archive date for a deleted case', () => {
      expect(
        getRegularArchiveDate({
          type: CaseType.CUSTODY,
          state: CaseState.DELETED,
          ...dates,
        }),
      ).toBeUndefined()
    })

    it('should have no regular archive date for an indictment', () => {
      expect(
        getRegularArchiveDate({
          type: CaseType.INDICTMENT,
          state: CaseState.RECEIVED,
          ...dates,
        }),
      ).toBeUndefined()
    })

    it('should have no regular archive date without the date the window is measured from', () => {
      expect(
        getRegularArchiveDate({
          type: CaseType.CUSTODY,
          state: CaseState.ACCEPTED,
          created,
          rulingDate,
          validToDate: undefined,
        }),
      ).toBeUndefined()
    })
  })
})
