import { Application } from '@island.is/application/types'
import { CustomerDebt } from './types'
import { getAmountToPay, getSelectedDebts } from './getSelectedDebts'

let nextPayId = 0

const debt = (overrides: Partial<CustomerDebt> = {}): CustomerDebt => ({
  payID: `PAY-${++nextPayId}`,
  chargeTypeId: 'AB',
  chargeTypeName: 'Gjaldflokkur',
  chargeItemSubject: '2024-1',
  timePeriod: '202601',
  dueDate: '2026-01-01',
  finalDueDate: '2026-02-01',
  principal: 800,
  interest: 150,
  cost: 50,
  debts: 1000,
  ...overrides,
})

const applicationWith = (
  debts: CustomerDebt[],
  selectedDebts: unknown,
  debtsToPay: unknown,
  selectedDebtIds: unknown = debts.map((d) => d.payID),
) =>
  ({
    externalData: {
      customerDebts: { data: { debts }, date: new Date(), status: 'success' },
    },
    answers: { selectedDebts, selectedDebtIds, debtsToPay },
  } as unknown as Application)

const amountsFor = (debts: CustomerDebt[], amounts: unknown[]) =>
  debts.map((d, index) => getAmountToPay(d, amounts[index] as string))

describe('getSelectedDebts', () => {
  it('returns only the ticked rows, keeping the answers index aligned', () => {
    const debts = [
      debt({ chargeTypeId: 'A' }),
      debt({ chargeTypeId: 'B' }),
      debt({ chargeTypeId: 'C' }),
    ]

    const selected = getSelectedDebts(
      applicationWith(debts, [false, true, false], ['999', '250', '999']),
    )

    expect(selected).toHaveLength(1)
    expect(selected[0].chargeTypeId).toBe('B')
    expect(selected[0].amountToPay).toBe(1000)
  })

  it('keeps an amount that is within the debt', () => {
    expect(amountsFor([debt({ debts: 1000 })], ['400'])).toEqual([400])
  })

  it('never charges more than the debt', () => {
    const debts = [debt({ debts: 1000 })]

    expect(amountsFor(debts, ['1001'])).toEqual([1000])
    expect(amountsFor(debts, ['9007199254740991'])).toEqual([1000])
  })

  it('never charges a zero or negative amount', () => {
    const debts = [debt({ debts: 1000 })]

    expect(amountsFor(debts, ['0'])).toEqual([1])
    expect(amountsFor(debts, ['-500'])).toEqual([1])
  })

  it('falls back to the full debt when no amount was given', () => {
    const debts = [debt({ debts: 1000 })]

    expect(amountsFor(debts, [undefined])).toEqual([1000])
    expect(amountsFor(debts, ['kr.'])).toEqual([1000])
  })

  it('clamps each row against its own debt', () => {
    const debts = [debt({ debts: 1000 }), debt({ debts: 50 })]

    expect(amountsFor(debts, ['5000', '5000'])).toEqual([1000, 50])
  })

  it('finds a ticked debt by payID after the list has shifted', () => {
    const [first, second, third] = [debt(), debt(), debt()]

    const selected = getSelectedDebts(
      applicationWith(
        [second, third],
        [false, true, false],
        ['', '250', ''],
        [first.payID, second.payID, third.payID],
      ),
    )

    expect(selected.map((d) => d.payID)).toEqual([second.payID])
    expect(selected[0].amountToPay).toBe(1000)
  })

  it('charges the full debt whatever amount was typed', () => {
    const debts = [debt({ debts: 1000 }), debt({ debts: 50 })]

    expect(
      getSelectedDebts(applicationWith(debts, [true, true], ['1', '25'])).map(
        (selected) => selected.amountToPay,
      ),
    ).toEqual([1000, 50])
  })

  it('drops a ticked debt that is no longer in the list', () => {
    const [settled, open] = [debt(), debt()]

    expect(
      getSelectedDebts(
        applicationWith([open], [true, false], [], [settled.payID, open.payID]),
      ),
    ).toEqual([])
  })

  it('selects nothing when the payIDs were never saved', () => {
    expect(
      getSelectedDebts(applicationWith([debt()], [true], [], null)),
    ).toEqual([])
  })

  it('returns nothing when the answers are missing entirely', () => {
    expect(
      getSelectedDebts(applicationWith([debt()], undefined, undefined)),
    ).toEqual([])
  })
})
