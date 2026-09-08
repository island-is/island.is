import type { CalculatorField } from '../../contracts/field'
import { toInterestBenefitQuery } from './interestBenefit'
import type { InterestBenefitInput } from './schema'
import { interestBenefitCalculator } from './schema'

const fieldsByName: Record<string, CalculatorField> = Object.fromEntries(
  interestBenefitCalculator.fields.map((field) => [field.name, field]),
)

describe('interestBenefit contract', () => {
  it('declares each field as authored', () => {
    expect(Object.keys(fieldsByName).sort()).toEqual([
      'assetBase',
      'incomeBase',
      'incomeYear',
      'loanBalance',
      'maritalStatus',
      'paidInterest',
    ])
    expect(fieldsByName).toMatchObject({
      maritalStatus: {
        type: 'select',
        required: true,
        options: [
          { value: 'single' },
          { value: 'singleParent' },
          { value: 'marriedOrCohabiting' },
        ],
      },
      incomeYear: { type: 'number', required: true, semantic: 'year' },
      incomeBase: { type: 'number', required: true, semantic: 'currency' },
      assetBase: { type: 'number', required: true, semantic: 'currency' },
      loanBalance: { type: 'number', required: true, semantic: 'currency' },
      paidInterest: { type: 'number', required: true, semantic: 'currency' },
    })
  })
})

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
