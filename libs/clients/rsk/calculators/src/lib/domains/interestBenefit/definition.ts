import type { InterestBenefitResult } from '../../../../gen/fetch'
import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
} from '../../types/define'

const interestBenefitInputFields = defineInputFields([
  {
    name: 'maritalStatus',
    type: 'select',
    required: true,
    options: [
      { value: 'single' },
      { value: 'singleParent' },
      { value: 'marriedOrCohabiting' },
    ],
  },
  { name: 'incomeYear', type: 'number', required: true, semantic: 'year' },
  { name: 'incomeBase', type: 'number', required: true, semantic: 'currency' },
  { name: 'assetBase', type: 'number', required: true, semantic: 'currency' },
  { name: 'loanBalance', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'paidInterest',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
] as const)

const interestBenefitOutputFields = defineOutputFields([
  { name: 'hjuskaparstada', kind: 'scalar', type: 'string' },
  { name: 'tekjuar', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'botaar', kind: 'scalar', type: 'number', semantic: 'year' },
  {
    name: 'hamarkVaxtagjalda',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'vaxtagjoldTilUtreiknings',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'tekjustofn', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'eignastofn', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'eftirstodvar',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'vaxtagjold',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'hamarkVaxtabota',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'skerdingVegnaTekna',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'vaxtabaeturEftirSkerdinguTekna',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'tekjuskerdingarhlutfall',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'skuldaskerdingarhlutfall',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'skerdingVegnaEigna',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'eignaskerdingarhlutfall',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'skerdingLog2003',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'skerdingLog2004',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'vaxtabaeturAlls',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'serstokVaxtanidurgreidsla',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'nadiHamarki', kind: 'scalar', type: 'boolean' },
  { name: 'varUndirLamarki', kind: 'scalar', type: 'boolean' },
] as const)

export const interestBenefitCalculator = defineCalculator({
  key: 'interestBenefit',
  inputFields: interestBenefitInputFields,
  outputFields: interestBenefitOutputFields,
} as const)

export interface InterestBenefitInput {
  maritalStatus: 'single' | 'singleParent' | 'marriedOrCohabiting'
  incomeYear: number
  incomeBase: number
  assetBase: number
  loanBalance: number
  paidInterest: number
}

export type InterestBenefitOutput = InterestBenefitResult
