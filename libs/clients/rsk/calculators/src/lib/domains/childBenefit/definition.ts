import type {
  ChildBenefitResult,
  GetChildBenefitData,
} from '../../../../gen/fetch'
import { Hjuskaparstada } from '../../../../gen/fetch'
import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
  enumOptions,
} from '../../types/define'

const childBenefitInputFields = defineInputFields([
  {
    name: 'hjuskaparstada',
    type: 'select',
    required: true,
    options: enumOptions(Hjuskaparstada),
  },
  { name: 'tekjuar', type: 'number', required: true, semantic: 'year' },
  { name: 'tekjustofn', type: 'number', required: true, semantic: 'currency' },
  { name: 'fjoldiBarna', type: 'number', required: true, semantic: 'count' },
  {
    name: 'fjoldiBarnaUndir7ara',
    type: 'number',
    required: false,
    semantic: 'count',
  },
  {
    name: 'skiptBornYfir7ara',
    type: 'number',
    required: false,
    semantic: 'count',
  },
  {
    name: 'skiptBornUndir7ara',
    type: 'number',
    required: false,
    semantic: 'count',
  },
] as const)

const childBenefitOutputFields = defineOutputFields([
  { name: 'hjuskaparstada', kind: 'scalar', type: 'string' },
  {
    name: 'fjoldiBarna',
    kind: 'scalar',
    type: 'number',
    semantic: 'count',
  },
  {
    name: 'fjoldiBarnaUndir7ara',
    kind: 'scalar',
    type: 'number',
    semantic: 'count',
  },
  { name: 'tekjuar', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'botaAr', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'tekjustofn', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'skerdingarhlutfall',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'skerdingarmork',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'efriSkerdingarmork',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'stofnTilSkerdingar',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'stofnTilUmframskerdingar',
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
    name: 'umframskerdingVegnaTekna',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'umframskerdingarhlutfall',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'oskertarBarnabaetur',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'barnabaeturPerBarn',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'barnabaeturAlls',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'greidslurArsfjordungi',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'tekjutengdarBarnabaetur',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'barnabaeturAllsPrHjon',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'vidbotBornYngriEn7ara',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'vidbotPerBarnYngraEn7ara',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'skerdingUndir7ara',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'skerdingarhlutfallUndir7ara',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  { name: 'faedingararBarna', kind: 'scalar', type: 'string' },
  { name: 'skiptBuseta', kind: 'scalar', type: 'boolean' },
  {
    name: 'skiptYfir7ara',
    kind: 'scalar',
    type: 'number',
    semantic: 'count',
  },
  {
    name: 'skiptUndir7ara',
    kind: 'scalar',
    type: 'number',
    semantic: 'count',
  },
  {
    name: 'barnabaeturFyrirSkiptingu',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
] as const)

export const childBenefitCalculator = defineCalculator({
  key: 'childBenefit',
  inputFields: childBenefitInputFields,
  outputFields: childBenefitOutputFields,
} as const)

export type ChildBenefitInput = GetChildBenefitData['query']

export type ChildBenefitOutput = ChildBenefitResult
