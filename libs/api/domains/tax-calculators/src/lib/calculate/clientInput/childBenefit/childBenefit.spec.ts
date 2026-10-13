import { toChildBenefitInput } from './childBenefit'

describe('client input builders', () => {
  it('builds a child benefit input, omitting absent optional fields', () => {
    expect(
      toChildBenefitInput({
        marriedOrCohabiting: true,
        incomeYear: 2026,
        incomeBase: 9000000,
        numberOfChildren: 2,
        numberOfChildrenUnder7: 1,
        splitCustody: false,
      }),
    ).toEqual({
      marriedOrCohabiting: true,
      incomeYear: 2026,
      incomeBase: 9000000,
      numberOfChildren: 2,
      numberOfChildrenUnder7: 1,
      splitCustody: false,
      splitCustodyChildrenOver7: undefined,
      splitCustodyChildrenUnder7: undefined,
    })
  })
})
