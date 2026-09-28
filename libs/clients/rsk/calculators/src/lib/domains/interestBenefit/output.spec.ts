import type { InterestBenefitResult } from '../../../../gen/fetch'
import { toInterestBenefitOutput } from './output'

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
  tekjuskerdingarhlutfall: 0.13,
  skuldaskerdingarhlutfall: 0.14,
  skerdingVegnaEigna: 15,
  eignaskerdingarhlutfall: 0.16,
  skerdingLog2003: 17,
  skerdingLog2004: 18,
  vaxtabaeturAlls: 19,
  serstokVaxtanidurgreidsla: 20,
  nadiHamarki: true,
  varUndirLamarki: true,
}

describe('toInterestBenefitOutput', () => {
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
    const empty: InterestBenefitResult = {
      hjuskaparstada: null,
    }
    const output = toInterestBenefitOutput(empty)

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
