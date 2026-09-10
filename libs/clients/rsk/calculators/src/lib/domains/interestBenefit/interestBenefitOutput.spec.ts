import type { InterestBenefitResult } from '../../../../gen/fetch'
import type { CalculatorOutputField } from '../../contracts/output'
import { interestBenefitCalculator } from './contract'
import { toInterestBenefitOutput } from './interestBenefitOutput'

const outputFieldsByName: Record<string, CalculatorOutputField> =
  Object.fromEntries(
    interestBenefitCalculator.outputFields.map((field) => [field.name, field]),
  )

const result: InterestBenefitResult = {
  hjuskaparstada: 'text-1',
  tekjuar: 2,
  botaar: 3,
  hamarkVaxtagjalda: 4,
  vaxtagjoldTilUtreiknings: 5,
  tekjustofn: 6,
  eignastofn: 7,
  eftirstodvar: 8,
  vaxtagjold: 9,
  hamarkVaxtabota: 10,
  skerdingVegnaTekna: 11,
  vaxtabaeturEftirSkerdinguTekna: 12,
  tekjuskerdingarhlutfall: 13,
  skuldaskerdingarhlutfall: 14,
  skerdingVegnaEigna: 15,
  eignaskerdingarhlutfall: 16,
  skerdingLog2003: 17,
  skerdingLog2004: 18,
  vaxtabaeturAlls: 19,
  serstokVaxtanidurgreidsla: 20,
  nadiHamarki: true,
  varUndirLamarki: true,
}

describe('interestBenefit output contract', () => {
  it('declares the curated output field set', () => {
    expect(Object.keys(outputFieldsByName).sort()).toEqual([
      'assetBase',
      'assetReduction',
      'assetReductionRate',
      'benefitYear',
      'debtReductionRate',
      'incomeBase',
      'incomeReduction',
      'incomeReductionRate',
      'incomeYear',
      'interestBenefitAfterIncomeReduction',
      'interestExpenses',
      'interestExpensesForCalculation',
      'loanBalance',
      'maritalStatusLabel',
      'maximumInterestBenefit',
      'maximumInterestExpenses',
      'reachedMaximum',
      'reductionLaw2003',
      'reductionLaw2004',
      'specialInterestReimbursement',
      'totalInterestBenefit',
      'wasBelowMinimum',
    ])
  })

  it('declares each output field as authored', () => {
    expect(outputFieldsByName).toMatchObject({
      maritalStatusLabel: { kind: 'scalar', type: 'string' },
      incomeYear: { kind: 'scalar', type: 'number', semantic: 'year' },
      benefitYear: { kind: 'scalar', type: 'number', semantic: 'year' },
      maximumInterestExpenses: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      interestExpensesForCalculation: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      incomeBase: { kind: 'scalar', type: 'number', semantic: 'currency' },
      assetBase: { kind: 'scalar', type: 'number', semantic: 'currency' },
      loanBalance: { kind: 'scalar', type: 'number', semantic: 'currency' },
      interestExpenses: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      maximumInterestBenefit: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      incomeReduction: { kind: 'scalar', type: 'number', semantic: 'currency' },
      interestBenefitAfterIncomeReduction: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      incomeReductionRate: {
        kind: 'scalar',
        type: 'number',
        semantic: 'percentage',
      },
      debtReductionRate: {
        kind: 'scalar',
        type: 'number',
        semantic: 'percentage',
      },
      assetReduction: { kind: 'scalar', type: 'number', semantic: 'currency' },
      assetReductionRate: {
        kind: 'scalar',
        type: 'number',
        semantic: 'percentage',
      },
      reductionLaw2003: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      reductionLaw2004: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      totalInterestBenefit: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      specialInterestReimbursement: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      reachedMaximum: { kind: 'scalar', type: 'boolean' },
      wasBelowMinimum: { kind: 'scalar', type: 'boolean' },
    })
  })
})

describe('toInterestBenefitOutput', () => {
  it('emits exactly the contract field set', () => {
    expect(Object.keys(toInterestBenefitOutput(result)).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
  })

  it('reads each output field from its own RSK source key', () => {
    expect(toInterestBenefitOutput(result)).toEqual({
      maritalStatusLabel: 'text-1',
      incomeYear: 2,
      benefitYear: 3,
      maximumInterestExpenses: 4,
      interestExpensesForCalculation: 5,
      incomeBase: 6,
      assetBase: 7,
      loanBalance: 8,
      interestExpenses: 9,
      maximumInterestBenefit: 10,
      incomeReduction: 11,
      interestBenefitAfterIncomeReduction: 12,
      incomeReductionRate: 13,
      debtReductionRate: 14,
      assetReduction: 15,
      assetReductionRate: 16,
      reductionLaw2003: 17,
      reductionLaw2004: 18,
      totalInterestBenefit: 19,
      specialInterestReimbursement: 20,
      reachedMaximum: true,
      wasBelowMinimum: true,
    })
  })

  it('maps an absent result to undefined scalars, never null', () => {
    /* Every nullable source key set to null, every other one omitted, so
     * both flavours of absence are covered by one fixture. */
    const empty: InterestBenefitResult = {
      hjuskaparstada: null,
    }
    const output = toInterestBenefitOutput(empty)

    expect(Object.keys(output).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
    expect(output.maritalStatusLabel).toBeUndefined()
    expect(output.incomeYear).toBeUndefined()
    expect(output.benefitYear).toBeUndefined()
    expect(output.maximumInterestExpenses).toBeUndefined()
    expect(output.interestExpensesForCalculation).toBeUndefined()
    expect(output.incomeBase).toBeUndefined()
    expect(output.assetBase).toBeUndefined()
    expect(output.loanBalance).toBeUndefined()
    expect(output.interestExpenses).toBeUndefined()
    expect(output.maximumInterestBenefit).toBeUndefined()
    expect(output.incomeReduction).toBeUndefined()
    expect(output.interestBenefitAfterIncomeReduction).toBeUndefined()
    expect(output.incomeReductionRate).toBeUndefined()
    expect(output.debtReductionRate).toBeUndefined()
    expect(output.assetReduction).toBeUndefined()
    expect(output.assetReductionRate).toBeUndefined()
    expect(output.reductionLaw2003).toBeUndefined()
    expect(output.reductionLaw2004).toBeUndefined()
    expect(output.totalInterestBenefit).toBeUndefined()
    expect(output.specialInterestReimbursement).toBeUndefined()
    expect(output.reachedMaximum).toBeUndefined()
    expect(output.wasBelowMinimum).toBeUndefined()
  })
})
