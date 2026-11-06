import { toInterestBenefitQuery } from './input'
import type { InterestBenefitInput } from './definition'

describe('toInterestBenefitQuery', () => {
  const input: InterestBenefitInput = {
    maritalStatus: 'single',
    incomeYear: 2025,
    incomeBase: 7000000,
    assetBase: 12000000,
    loanBalance: 25000000,
    paidInterest: 900000,
  }

  it('emits every RSK parameter and nothing else', () => {
    expect(toInterestBenefitQuery(input)).toEqual({
      hjuskaparstada: 1,
      tekjuar: 2025,
      tekjustofn: 7000000,
      eignastofn: 12000000,
      eftirstodvar: 25000000,
      greiddVaxtagjold: 900000,
    })
  })

  it('maps every marital status to its RSK code', () => {
    expect(
      toInterestBenefitQuery({ ...input, maritalStatus: 'singleParent' })
        .hjuskaparstada,
    ).toBe(2)
    expect(
      toInterestBenefitQuery({ ...input, maritalStatus: 'marriedOrCohabiting' })
        .hjuskaparstada,
    ).toBe(3)
  })
})
