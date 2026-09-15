import type { InterestBenefitResult } from '../../../../gen/fetch'
import type { InterestBenefitOutput } from './contract'

export const toInterestBenefitOutput = (
  result: InterestBenefitResult,
): InterestBenefitOutput => ({
  maritalStatusLabel: result.hjuskaparstada ?? undefined,
  incomeYear: result.tekjuar ?? undefined,
  benefitYear: result.botaar ?? undefined,
  maximumInterestExpenses: result.hamarkVaxtagjalda ?? undefined,
  interestExpensesForCalculation: result.vaxtagjoldTilUtreiknings ?? undefined,
  incomeBase: result.tekjustofn ?? undefined,
  assetBase: result.eignastofn ?? undefined,
  loanBalance: result.eftirstodvar ?? undefined,
  interestExpenses: result.vaxtagjold ?? undefined,
  maximumInterestBenefit: result.hamarkVaxtabota ?? undefined,
  incomeReduction: result.skerdingVegnaTekna ?? undefined,
  interestBenefitAfterIncomeReduction:
    result.vaxtabaeturEftirSkerdinguTekna ?? undefined,
  incomeReductionRate: result.tekjuskerdingarhlutfall ?? undefined,
  debtReductionRate: result.skuldaskerdingarhlutfall ?? undefined,
  assetReduction: result.skerdingVegnaEigna ?? undefined,
  assetReductionRate: result.eignaskerdingarhlutfall ?? undefined,
  reductionLaw2003: result.skerdingLog2003 ?? undefined,
  reductionLaw2004: result.skerdingLog2004 ?? undefined,
  totalInterestBenefit: result.vaxtabaeturAlls ?? undefined,
  specialInterestReimbursement: result.serstokVaxtanidurgreidsla ?? undefined,
  reachedMaximum: result.nadiHamarki ?? undefined,
  wasBelowMinimum: result.varUndirLamarki ?? undefined,
})
