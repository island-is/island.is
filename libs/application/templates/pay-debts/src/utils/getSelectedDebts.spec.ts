import { Application } from '@island.is/application/types'
import { CustomerDebt } from './types'
import { getSelectedDebts } from './getSelectedDebts'

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
