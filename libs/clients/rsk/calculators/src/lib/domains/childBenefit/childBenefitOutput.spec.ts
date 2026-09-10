import type { ChildBenefitResult } from '../../../../gen/fetch'
import type { CalculatorOutputField } from '../../contracts/output'
import { childBenefitCalculator } from './contract'
import { toChildBenefitOutput } from './childBenefitOutput'

const outputFieldsByName: Record<string, CalculatorOutputField> =
  Object.fromEntries(
    childBenefitCalculator.outputFields.map((field) => [field.name, field]),
  )

const result: ChildBenefitResult = {
  hjuskaparstada: 'text-1',
  fjoldiBarna: 2,
  fjoldiBarnaUndir7ara: 3,
  tekjuar: 4,
  botaAr: 5,
  tekjustofn: 6,
  skerdingarhlutfall: 7,
  skerdingarmork: 8,
  efriSkerdingarmork: 9,
  stofnTilSkerdingar: 10,
  stofnTilUmframskerdingar: 11,
  skerdingVegnaTekna: 12,
  umframskerdingVegnaTekna: 13,
  umframskerdingarhlutfall: 14,
  oskertarBarnabaetur: 15,
  barnabaeturPerBarn: 16,
  barnabaeturAlls: 17,
  greidslurArsfjordungi: 18,
  tekjutengdarBarnabaetur: 19,
  barnabaeturAllsPrHjon: 20,
  vidbotBornYngriEn7ara: 21,
  vidbotPerBarnYngraEn7ara: 22,
  skerdingUndir7ara: 23,
  skerdingarhlutfallUndir7ara: 24,
  faedingararBarna: 'text-25',
  skiptBuseta: true,
  skiptYfir7ara: 27,
  skiptUndir7ara: 28,
  barnabaeturFyrirSkiptingu: 29,
}

describe('childBenefit output contract', () => {
  it('declares the curated output field set', () => {
    expect(Object.keys(outputFieldsByName).sort()).toEqual([
      'additionalBenefitForChildrenUnder7',
      'additionalBenefitPerChildUnder7',
      'benefitYear',
      'childBenefitBeforeSplit',
      'childBenefitPerChild',
      'childrenBirthYears',
      'excessIncomeReduction',
      'excessReductionBase',
      'excessReductionRate',
      'incomeBase',
      'incomeReduction',
      'incomeRelatedChildBenefit',
      'incomeYear',
      'maritalStatusLabel',
      'numberOfChildren',
      'numberOfChildrenUnder7',
      'quarterlyPayments',
      'reductionBase',
      'reductionForChildrenUnder7',
      'reductionRate',
      'reductionRateForChildrenUnder7',
      'reductionThreshold',
      'splitCustody',
      'splitCustodyChildrenOver7',
      'splitCustodyChildrenUnder7',
      'totalChildBenefit',
      'totalChildBenefitPerCouple',
      'unreducedChildBenefit',
      'upperReductionThreshold',
    ])
  })

  it('declares each output field as authored', () => {
    expect(outputFieldsByName).toMatchObject({
      maritalStatusLabel: { kind: 'scalar', type: 'string' },
      numberOfChildren: { kind: 'scalar', type: 'number', semantic: 'count' },
      numberOfChildrenUnder7: {
        kind: 'scalar',
        type: 'number',
        semantic: 'count',
      },
      incomeYear: { kind: 'scalar', type: 'number', semantic: 'year' },
      benefitYear: { kind: 'scalar', type: 'number', semantic: 'year' },
      incomeBase: { kind: 'scalar', type: 'number', semantic: 'currency' },
      reductionRate: { kind: 'scalar', type: 'number', semantic: 'percentage' },
      reductionThreshold: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      upperReductionThreshold: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      reductionBase: { kind: 'scalar', type: 'number', semantic: 'currency' },
      excessReductionBase: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      incomeReduction: { kind: 'scalar', type: 'number', semantic: 'currency' },
      excessIncomeReduction: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      excessReductionRate: {
        kind: 'scalar',
        type: 'number',
        semantic: 'percentage',
      },
      unreducedChildBenefit: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      childBenefitPerChild: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      totalChildBenefit: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      quarterlyPayments: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      incomeRelatedChildBenefit: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      totalChildBenefitPerCouple: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      additionalBenefitForChildrenUnder7: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      additionalBenefitPerChildUnder7: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      reductionForChildrenUnder7: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      reductionRateForChildrenUnder7: {
        kind: 'scalar',
        type: 'number',
        semantic: 'percentage',
      },
      childrenBirthYears: { kind: 'scalar', type: 'string' },
      splitCustody: { kind: 'scalar', type: 'boolean' },
      splitCustodyChildrenOver7: {
        kind: 'scalar',
        type: 'number',
        semantic: 'count',
      },
      splitCustodyChildrenUnder7: {
        kind: 'scalar',
        type: 'number',
        semantic: 'count',
      },
      childBenefitBeforeSplit: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
    })
  })
})

describe('toChildBenefitOutput', () => {
  it('emits exactly the contract field set', () => {
    expect(Object.keys(toChildBenefitOutput(result)).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
  })

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
    /* Every nullable source key set to null, every other one omitted, so
     * both flavours of absence are covered by one fixture. */
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

    expect(Object.keys(output).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
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
