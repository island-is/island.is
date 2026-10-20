import { Application } from '@island.is/application/types'
import {
  buildCanEditRow,
  buildCanRemoveRow,
  isEntryEdited,
  splitPersisted,
} from './reconcile'
import {
  toCapitalIncomeRow,
  toCasualWorkRow,
  toPensionRow,
} from './persistedRows'

const casualWorkRecord = {
  id: 'job-1',
  employerSSN: '0123456789',
  employerName: 'Byko ehf ',
  periodFrom: '2026-09-02T00:00:00',
  periodTo: '2026-09-30T00:00:00',
  estimatedIncome: 150000,
  workShiftPeriodIds: ['shift-1'],
  canEdit: true,
  canDelete: true,
}

const pensionRecord = {
  id: 'pension-1',
  incomeTypeId: 'type-1',
  pensionFundId: 'fund-1',
  estimatedIncome: 50000,
  periodFrom: '2026-09-01T00:00:00',
  periodTo: null,
}

describe('isEntryEdited', () => {
  it('treats a row seeded from the persisted record as unchanged', () => {
    const persistedRow = toCasualWorkRow(casualWorkRecord)
    expect(isEntryEdited({ ...persistedRow }, persistedRow)).toBe(false)
  })

  it('ignores encoding differences between answers and persisted values', () => {
    const persistedRow = toCasualWorkRow(casualWorkRecord)
    const entry = {
      validationId: 'job-1',
      company: { nationalId: '012345-6789', name: 'BYKO ehf.' },
      dateFrom: '2026-09-02',
      dateTo: '2026-09-30',
      estimatedIncome: '150000.0',
      workshiftPeriod: 'shift-1',
      disabled: 'false',
    }

    expect(isEntryEdited(entry, persistedRow)).toBe(false)
  })

  it('treats null, undefined and empty strings as the same empty value', () => {
    const persistedRow = toPensionRow(pensionRecord)
    const entry = {
      ...persistedRow,
      dateTo: undefined,
      paymentFrequency: 'monthly',
    }

    expect(isEntryEdited(entry, persistedRow)).toBe(false)
  })

  it.each([
    ['dateFrom', { dateFrom: '2026-09-03' }],
    ['estimatedIncome', { estimatedIncome: '160000' }],
    ['workshiftPeriod', { workshiftPeriod: 'shift-2' }],
    [
      'company national id',
      { company: { nationalId: '0123456780', name: 'Byko ehf' } },
    ],
  ])('detects a changed %s', (_, change) => {
    const persistedRow = toCasualWorkRow(casualWorkRecord)
    expect(isEntryEdited({ ...persistedRow, ...change }, persistedRow)).toBe(
      true,
    )
  })

  it('detects a cleared value', () => {
    const persistedRow = toCasualWorkRow(casualWorkRecord)
    expect(isEntryEdited({ ...persistedRow, dateTo: '' }, persistedRow)).toBe(
      true,
    )
  })
})

describe('payment frequency from oneTimePayment', () => {
  const capitalRecord = {
    id: 'capital-1',
    incomeTypeId: 'rent',
    estimatedIncome: 1000,
    periodFrom: '2026-09-05T00:00:00',
  }

  it('maps a one-time payment without an end date', () => {
    expect(
      toCapitalIncomeRow({
        ...capitalRecord,
        periodTo: '2026-09-05T00:00:00',
        oneTimePayment: true,
      }),
    ).toMatchObject({ paymentFrequency: 'oneTime', dateTo: '' })
  })

  it.each([
    ['false', false],
    ['missing', undefined],
  ])('treats a %s flag as monthly', (_, oneTimePayment) => {
    expect(
      toCapitalIncomeRow({
        ...capitalRecord,
        periodTo: '2026-09-05T00:00:00',
        oneTimePayment,
      }),
    ).toMatchObject({
      paymentFrequency: 'monthly',
      dateTo: '2026-09-05T00:00:00',
    })
  })

  it('ignores a stale dateTo on one-time payments', () => {
    const persistedRow = toCapitalIncomeRow({
      ...capitalRecord,
      periodTo: null,
      oneTimePayment: true,
    })

    expect(
      isEntryEdited({ ...persistedRow, dateTo: '2026-09-20' }, persistedRow),
    ).toBe(false)
  })

  it('detects a changed payment frequency', () => {
    const persistedRow = toCapitalIncomeRow({
      ...capitalRecord,
      periodTo: null,
      oneTimePayment: false,
    })

    expect(
      isEntryEdited(
        { ...persistedRow, paymentFrequency: 'oneTime' },
        persistedRow,
      ),
    ).toBe(true)
  })
})

describe('splitPersisted', () => {
  const unchanged = toCasualWorkRow(casualWorkRecord)
  const otherRecord = { ...casualWorkRecord, id: 'job-2' }
  const removedRecord = { ...casualWorkRecord, id: 'job-3' }
  const edited = { ...toCasualWorkRow(otherRecord), estimatedIncome: '1' }
  const created = { ...unchanged, validationId: 'new-row' }
  const records = [casualWorkRecord, otherRecord, removedRecord]

  it('reports edited retained rows as updates when toRow is given', () => {
    const result = splitPersisted(
      [unchanged, edited, created],
      records,
      'validationId',
      toCasualWorkRow,
    )

    expect(result.creates).toEqual([created])
    expect(result.updates).toEqual([edited])
    expect(result.removedRecords).toEqual([removedRecord])
  })

  it('reports no updates without toRow', () => {
    const result = splitPersisted([unchanged, edited, created], records)

    expect(result.creates).toEqual([created])
    expect(result.updates).toEqual([])
    expect(result.removedRecords).toEqual([removedRecord])
  })

  it('treats rows flagged isRemoved as deleted rather than edited', () => {
    const result = splitPersisted(
      [unchanged, { ...edited, isRemoved: true }],
      records,
      'validationId',
      toCasualWorkRow,
    )

    expect(result.updates).toEqual([])
    expect(result.removedRecords).toEqual([otherRecord, removedRecord])
  })

  it('drops edits and deletes of records whose flags lock them', () => {
    const lockedEdit = { ...otherRecord, canEdit: false }
    const lockedDelete = { ...removedRecord, canDelete: false }

    const result = splitPersisted(
      [unchanged, edited],
      [casualWorkRecord, lockedEdit, lockedDelete],
      'validationId',
      toCasualWorkRow,
    )

    expect(result.updates).toEqual([])
    expect(result.removedRecords).toEqual([])
  })

  it('treats missing flags as locked', () => {
    const withoutFlags = {
      ...otherRecord,
      canEdit: undefined,
      canDelete: undefined,
    }
    const removedWithoutFlags = { ...withoutFlags, id: 'job-3' }

    const result = splitPersisted(
      [unchanged, edited],
      [casualWorkRecord, withoutFlags, removedWithoutFlags],
      'validationId',
      toCasualWorkRow,
    )

    expect(result.updates).toEqual([])
    expect(result.removedRecords).toEqual([])
  })
})

describe('row gates', () => {
  const persistedPath = 'income.data.irregularJobs'
  const buildApplication = (
    flags: { canEdit?: boolean; canDelete?: boolean } = {},
  ) =>
    ({
      externalData: {
        income: {
          data: { irregularJobs: [{ id: 'job-1', ...flags }] },
        },
      },
    } as unknown as Application)

  it.each([
    ['buildCanRemoveRow', buildCanRemoveRow, 'canDelete'],
    ['buildCanEditRow', buildCanEditRow, 'canEdit'],
  ] as const)('%s follows the persisted %s flag', (_, buildGate, flag) => {
    const gate = buildGate(persistedPath)
    const row = { validationId: 'job-1' }

    expect(gate(buildApplication({ [flag]: true }), row)).toBe(true)
    expect(gate(buildApplication({ [flag]: false }), row)).toBe(false)
    expect(gate(buildApplication(), row)).toBe(false)
  })

  it.each([buildCanRemoveRow, buildCanEditRow])(
    'always allows rows added in this session',
    (buildGate) => {
      const gate = buildGate(persistedPath)
      const application = buildApplication({
        canEdit: false,
        canDelete: false,
      })

      expect(gate(application, { validationId: 'new-row' })).toBe(true)
      expect(gate(application, {})).toBe(true)
    },
  )
})
