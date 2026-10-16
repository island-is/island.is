import { toChildBenefitQuery } from './input'
import type { ChildBenefitInput } from './definition'

describe('toChildBenefitQuery', () => {
  const input: ChildBenefitInput = {
    marriedOrCohabiting: true,
    incomeYear: 2025,
    incomeBase: 9000000,
    numberOfChildren: 3,
    numberOfChildrenUnder7: 1,
    splitCustody: true,
    splitCustodyChildrenOver7: 2,
    splitCustodyChildrenUnder7: 1,
  }

  it('emits every RSK parameter and nothing else', () => {
    expect(toChildBenefitQuery(input)).toEqual({
      hjuskaparstada: true,
      tekjuar: 2025,
      tekjustofn: 9000000,
      fjoldiBarna: 3,
      fjoldiBarnaUndir7ara: 1,
      skiptBuseta: true,
      skiptBornYfir7ara: 2,
      skiptBornUndir7ara: 1,
    })
  })

  it('withholds the split-custody counts unless splitCustody is set', () => {
    const query = toChildBenefitQuery({ ...input, splitCustody: false })

    expect(query.skiptBuseta).toBe(false)
    expect(query.skiptBornYfir7ara).toBeUndefined()
    expect(query.skiptBornUndir7ara).toBeUndefined()
  })
})
