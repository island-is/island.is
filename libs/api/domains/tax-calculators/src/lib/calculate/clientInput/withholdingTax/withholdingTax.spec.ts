import type { SubmittedValues } from '../../submission/submission'
import { toWithholdingTaxInput } from './withholdingTax'

const values: SubmittedValues = {
  launGreidast: 'Mánaðarlega',
  hjuskaparstada: 'Einhleypingur',
  tekjuar: 2026,
  launamanudur: 9,
  laun: 800000,
  lifeyrissjodurHlutfall: 4,
  sereignHlutfall: 2,
  nytingSkattkorts: 100,
  nytingSkattkortsMaka: 0,
  uppsafnadurPersonuafslattur: 0,
  orlof: 0,
  stettarfelag: 0,
  annad: 0,
  motframlagLifeyrissjodur: 11.5,
  okutaekjastyrkurUtan: 0,
  idgjaldSlysatryggingSjomanna: 0,
}

describe('client input builders', () => {
  it('carries whole-percent values through unchanged', () => {
    expect(toWithholdingTaxInput(values)).toEqual(values)
  })

  it('throws when a required field is absent', () => {
    const { laun: _laun, ...withoutSalary } = values

    expect(() => toWithholdingTaxInput(withoutSalary)).toThrow(
      /missing required field "laun"/,
    )
  })

  it('throws on a marital status outside the generated enum', () => {
    expect(() =>
      toWithholdingTaxInput({ ...values, hjuskaparstada: 'Gift/Í sambúð' }),
    ).toThrow(/permitted option/)
  })
})
