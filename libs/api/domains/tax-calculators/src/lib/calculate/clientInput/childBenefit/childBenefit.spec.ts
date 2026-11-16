import { toChildBenefitInput } from './childBenefit'

describe('client input builders', () => {
  it('builds a child benefit input, omitting absent optional fields', () => {
    expect(
      toChildBenefitInput({
        hjuskaparstada: 'Gift/Í sambúð',
        tekjuar: 2025,
        tekjustofn: 9000000,
        fjoldiBarna: 2,
      }),
    ).toEqual({
      hjuskaparstada: 'Gift/Í sambúð',
      tekjuar: 2025,
      tekjustofn: 9000000,
      fjoldiBarna: 2,
      fjoldiBarnaUndir7ara: undefined,
      skiptBornYfir7ara: undefined,
      skiptBornUndir7ara: undefined,
    })
  })

  it('throws on a marital status outside the generated enum', () => {
    expect(() =>
      toChildBenefitInput({
        hjuskaparstada: 'Einhleypingur',
        tekjuar: 2025,
        tekjustofn: 9000000,
        fjoldiBarna: 2,
      }),
    ).toThrow(/permitted option/)
  })
})
