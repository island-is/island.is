import type { ChildBenefitResult } from '../../../../gen/fetch'
import { rskRatioToPercent } from '../../utils/rskRatioToPercent'
import type { ChildBenefitOutput } from './contract'

export const toChildBenefitOutput = (
  result: ChildBenefitResult,
): ChildBenefitOutput => ({
  maritalStatusLabel: result.hjuskaparstada ?? undefined,
  numberOfChildren: result.fjoldiBarna ?? undefined,
  numberOfChildrenUnder7: result.fjoldiBarnaUndir7ara ?? undefined,
  incomeYear: result.tekjuar ?? undefined,
  benefitYear: result.botaAr ?? undefined,
  incomeBase: result.tekjustofn ?? undefined,
  reductionRate: rskRatioToPercent(result.skerdingarhlutfall),
  reductionThreshold: result.skerdingarmork ?? undefined,
  upperReductionThreshold: result.efriSkerdingarmork ?? undefined,
  reductionBase: result.stofnTilSkerdingar ?? undefined,
  excessReductionBase: result.stofnTilUmframskerdingar ?? undefined,
  incomeReduction: result.skerdingVegnaTekna ?? undefined,
  excessIncomeReduction: result.umframskerdingVegnaTekna ?? undefined,
  excessReductionRate: rskRatioToPercent(result.umframskerdingarhlutfall),
  unreducedChildBenefit: result.oskertarBarnabaetur ?? undefined,
  childBenefitPerChild: result.barnabaeturPerBarn ?? undefined,
  totalChildBenefit: result.barnabaeturAlls ?? undefined,
  quarterlyPayments: result.greidslurArsfjordungi ?? undefined,
  incomeRelatedChildBenefit: result.tekjutengdarBarnabaetur ?? undefined,
  totalChildBenefitPerCouple: result.barnabaeturAllsPrHjon ?? undefined,
  additionalBenefitForChildrenUnder7: result.vidbotBornYngriEn7ara ?? undefined,
  additionalBenefitPerChildUnder7: result.vidbotPerBarnYngraEn7ara ?? undefined,
  reductionForChildrenUnder7: result.skerdingUndir7ara ?? undefined,
  reductionRateForChildrenUnder7: rskRatioToPercent(
    result.skerdingarhlutfallUndir7ara,
  ),
  childrenBirthYears: result.faedingararBarna ?? undefined,
  splitCustody: result.skiptBuseta ?? undefined,
  splitCustodyChildrenOver7: result.skiptYfir7ara ?? undefined,
  splitCustodyChildrenUnder7: result.skiptUndir7ara ?? undefined,
  childBenefitBeforeSplit: result.barnabaeturFyrirSkiptingu ?? undefined,
})
