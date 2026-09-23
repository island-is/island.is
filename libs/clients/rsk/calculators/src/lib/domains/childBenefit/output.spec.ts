import type { ChildBenefitResult } from '../../../../gen/fetch'
import { toChildBenefitOutput } from './output'

const result: ChildBenefitResult = {
  hjuskaparstada: 'text-1',
  fjoldiBarna: 2,
  fjoldiBarnaUndir7ara: 3,
  tekjuar: 4,
  botaAr: 5,
  tekjustofn: 6,
  skerdingarhlutfall: 0.07,
  skerdingarmork: 8,
  efriSkerdingarmork: 9,
  stofnTilSkerdingar: 10,
  stofnTilUmframskerdingar: 11,
  skerdingVegnaTekna: 12,
  umframskerdingVegnaTekna: 13,
  umframskerdingarhlutfall: 0.14,
  oskertarBarnabaetur: 15,
  barnabaeturPerBarn: 16,
  barnabaeturAlls: 17,
  greidslurArsfjordungi: 18,
  tekjutengdarBarnabaetur: 19,
  barnabaeturAllsPrHjon: 20,
  vidbotBornYngriEn7ara: 21,
  vidbotPerBarnYngraEn7ara: 22,
  skerdingUndir7ara: 23,
  skerdingarhlutfallUndir7ara: 0.24,
  faedingararBarna: 'text-25',
  skiptBuseta: true,
  skiptYfir7ara: 27,
  skiptUndir7ara: 28,
  barnabaeturFyrirSkiptingu: 29,
}

describe('toChildBenefitOutput', () => {
  it('reads each output field from its own RSK source key', () => {
    expect(toChildBenefitOutput(result)).toEqual({
      maritalStatusLabel: 'text-1',
      numberOfChildren: 2,
      numberOfChildrenUnder7: 3,
      incomeYear: 4,
      benefitYear: 5,
      incomeBase: 6,
      reductionRate: 7,
      reductionThreshold: 8,
      upperReductionThreshold: 9,
      reductionBase: 10,
      excessReductionBase: 11,
      incomeReduction: 12,
      excessIncomeReduction: 13,
      excessReductionRate: 14,
      unreducedChildBenefit: 15,
      childBenefitPerChild: 16,
      totalChildBenefit: 17,
      quarterlyPayments: 18,
      incomeRelatedChildBenefit: 19,
      totalChildBenefitPerCouple: 20,
      additionalBenefitForChildrenUnder7: 21,
      additionalBenefitPerChildUnder7: 22,
      reductionForChildrenUnder7: 23,
      reductionRateForChildrenUnder7: 24,
      childrenBirthYears: 'text-25',
      splitCustody: true,
      splitCustodyChildrenOver7: 27,
      splitCustodyChildrenUnder7: 28,
      childBenefitBeforeSplit: 29,
    })
  })

  it('maps an absent result to undefined scalars, never null', () => {
    const empty: ChildBenefitResult = {
      hjuskaparstada: null,
      efriSkerdingarmork: null,
      stofnTilUmframskerdingar: null,
      umframskerdingVegnaTekna: null,
      umframskerdingarhlutfall: null,
      faedingararBarna: null,
      skiptYfir7ara: null,
      skiptUndir7ara: null,
      barnabaeturFyrirSkiptingu: null,
    }
    const output = toChildBenefitOutput(empty)

    expect(output.maritalStatusLabel).toBeUndefined()
    expect(output.numberOfChildren).toBeUndefined()
    expect(output.numberOfChildrenUnder7).toBeUndefined()
    expect(output.incomeYear).toBeUndefined()
    expect(output.benefitYear).toBeUndefined()
    expect(output.incomeBase).toBeUndefined()
    expect(output.reductionRate).toBeUndefined()
    expect(output.reductionThreshold).toBeUndefined()
    expect(output.upperReductionThreshold).toBeUndefined()
    expect(output.reductionBase).toBeUndefined()
    expect(output.excessReductionBase).toBeUndefined()
    expect(output.incomeReduction).toBeUndefined()
    expect(output.excessIncomeReduction).toBeUndefined()
    expect(output.excessReductionRate).toBeUndefined()
    expect(output.unreducedChildBenefit).toBeUndefined()
    expect(output.childBenefitPerChild).toBeUndefined()
    expect(output.totalChildBenefit).toBeUndefined()
    expect(output.quarterlyPayments).toBeUndefined()
    expect(output.incomeRelatedChildBenefit).toBeUndefined()
    expect(output.totalChildBenefitPerCouple).toBeUndefined()
    expect(output.additionalBenefitForChildrenUnder7).toBeUndefined()
    expect(output.additionalBenefitPerChildUnder7).toBeUndefined()
    expect(output.reductionForChildrenUnder7).toBeUndefined()
    expect(output.reductionRateForChildrenUnder7).toBeUndefined()
    expect(output.childrenBirthYears).toBeUndefined()
    expect(output.splitCustody).toBeUndefined()
    expect(output.splitCustodyChildrenOver7).toBeUndefined()
    expect(output.splitCustodyChildrenUnder7).toBeUndefined()
    expect(output.childBenefitBeforeSplit).toBeUndefined()
  })
})
