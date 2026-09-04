import { ExternalData } from '@island.is/application/types'
import { CustomerDebt } from './types'
import {
  DEBTS_MAX_AGE_MS,
  debtsAreStale,
  debtsSignature,
  hasFetchedDebts,
} from './getDebts'

const debtsFetchedAt = (date: Date | string | undefined, status = 'success') =>
  ({
    customerDebts: { data: { debts: [] }, date, status },
  } as unknown as ExternalData)

const debt = (overrides: Partial<CustomerDebt> = {}): CustomerDebt => ({
  chargeTypeId: 'AB',
  chargeTypeName: 'Gjaldflokkur',
  chargeItemSubject: '2024-1',
  timePeriod: '202601',
  dueDate: '2026-01-01',
  finalDueDate: '2026-02-01',
  debts: 1000,
  ...overrides,
})

describe('hasFetchedDebts', () => {
  it('is true only for a successful result, regardless of age', () => {
    const ancient = new Date(Date.now() - DEBTS_MAX_AGE_MS * 24)

    expect(hasFetchedDebts(debtsFetchedAt(ancient))).toBe(true)
    expect(hasFetchedDebts(debtsFetchedAt(new Date(), 'failure'))).toBe(false)
    expect(hasFetchedDebts({} as ExternalData)).toBe(false)
  })
})

describe('debtsAreStale', () => {
  it('is false for a result fetched inside the window', () => {
    const justNow = new Date(Date.now() - 60 * 1000)

    expect(debtsAreStale(debtsFetchedAt(justNow))).toBe(false)
  })

  it('is true once the window has elapsed', () => {
    const old = new Date(Date.now() - DEBTS_MAX_AGE_MS - 60 * 1000)

    expect(debtsAreStale(debtsFetchedAt(old))).toBe(true)
  })

  it('is true when the result is absent, failed or undated', () => {
    expect(debtsAreStale({} as ExternalData)).toBe(true)
    expect(debtsAreStale(debtsFetchedAt(new Date(), 'failure'))).toBe(true)
    expect(debtsAreStale(debtsFetchedAt(undefined))).toBe(true)
    expect(debtsAreStale(debtsFetchedAt('not a date'))).toBe(true)
  })
})

describe('debtsSignature', () => {
  it('is stable for an identical list', () => {
    expect(debtsSignature([debt(), debt({ chargeTypeId: 'CD' })])).toBe(
      debtsSignature([debt(), debt({ chargeTypeId: 'CD' })]),
    )
  })

  it('changes when an amount changes', () => {
    expect(debtsSignature([debt({ debts: 1000 })])).not.toBe(
      debtsSignature([debt({ debts: 1500 })]),
    )
  })

  it('changes when the order changes', () => {
    const a = debt({ chargeTypeId: 'AB' })
    const b = debt({ chargeTypeId: 'CD' })

    expect(debtsSignature([a, b])).not.toBe(debtsSignature([b, a]))
  })

  it('changes when a debt is added or removed', () => {
    expect(debtsSignature([debt()])).not.toBe(debtsSignature([]))
    expect(debtsSignature([debt(), debt({ chargeTypeId: 'CD' })])).not.toBe(
      debtsSignature([debt()]),
    )
  })

  it('distinguishes debts that differ only by period or due date', () => {
    expect(debtsSignature([debt({ chargeItemSubject: '2024-1' })])).not.toBe(
      debtsSignature([debt({ chargeItemSubject: '2024-2' })]),
    )
    expect(debtsSignature([debt({ dueDate: '2026-01-01' })])).not.toBe(
      debtsSignature([debt({ dueDate: '2026-03-01' })]),
    )
    expect(debtsSignature([debt({ timePeriod: '202601' })])).not.toBe(
      debtsSignature([debt({ timePeriod: '202603' })]),
    )
  })
})
