import type {
  GetWithholdingTaxData,
  TaxBracket,
  WithholdingTaxResult,
} from '../../../../gen/fetch'
import { HjuskaparstadaStadgreidsla, LaunGreidast } from '../../../../gen/fetch'
import {
  defineCalculator,
  defineInputFields,
  defineOutputFields,
  enumOptions,
} from '../../types/define'

const withholdingTaxInputFields = defineInputFields([
  {
    name: 'launGreidast',
    type: 'select',
    required: true,
    options: enumOptions(LaunGreidast),
  },
  {
    name: 'hjuskaparstada',
    type: 'select',
    required: true,
    options: enumOptions(HjuskaparstadaStadgreidsla),
  },
  { name: 'tekjuar', type: 'number', required: true, semantic: 'year' },
  { name: 'launamanudur', type: 'number', required: true, semantic: 'month' },
  { name: 'laun', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'lifeyrissjodurHlutfall',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'sereignHlutfall',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'nytingSkattkorts',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'nytingSkattkortsMaka',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'uppsafnadurPersonuafslattur',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
  { name: 'orlof', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'stettarfelag',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
  { name: 'annad', type: 'number', required: true, semantic: 'currency' },
  {
    name: 'motframlagLifeyrissjodur',
    type: 'number',
    required: true,
    semantic: 'percentage',
  },
  {
    name: 'okutaekjastyrkurUtan',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
  {
    name: 'idgjaldSlysatryggingSjomanna',
    type: 'number',
    required: true,
    semantic: 'currency',
  },
] as const)

const withholdingTaxOutputFields = defineOutputFields([
  {
    name: 'manadarlaun',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'lifeyrisjodurProsenta',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'sereignProsenta',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'lifeyrissjodur',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'sereignarsjodur',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'fradratturAlls',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'personuafslattur',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'personuafslatturFraMaka',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'skattstofn', kind: 'scalar', type: 'number', semantic: 'currency' },
  {
    name: 'reiknudStadgreidsla',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'greiddStadgreidsla',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'hatekjuskattur',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'reiknadiHatekjuskatt', kind: 'scalar', type: 'boolean' },
  {
    name: 'utborgudLaun',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'uppsafnadurPersonuafslattur',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  { name: 'tekjuar', kind: 'scalar', type: 'number', semantic: 'year' },
  { name: 'hjuskaparstada', kind: 'scalar', type: 'number' },
  { name: 'launamanudur', kind: 'scalar', type: 'number', semantic: 'month' },
  {
    name: 'fritekjumarkBarns',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'faedingararBarns',
    kind: 'scalar',
    type: 'number',
    semantic: 'year',
  },
  {
    name: 'stadgreidsluhlutfall',
    kind: 'scalar',
    type: 'number',
    semantic: 'percentage',
  },
  {
    name: 'motframlag',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'tryggingagjaldsstofn',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'tryggingagjald',
    kind: 'scalar',
    type: 'number',
    semantic: 'currency',
  },
  {
    name: 'skattthrep',
    kind: 'array',
    itemFields: [
      {
        name: 'nedriMork',
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      { name: 'numerThreps', kind: 'scalar', type: 'number' },
      {
        name: 'stadgreidsluhlutfall',
        kind: 'scalar',
        type: 'number',
        semantic: 'percentage',
      },
      {
        name: 'reiknudStadgreidsla',
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
    ],
  },
] as const)

export const withholdingTaxCalculator = defineCalculator({
  key: 'withholdingTax',
  inputFields: withholdingTaxInputFields,
  outputFields: withholdingTaxOutputFields,
} as const)

export type WithholdingTaxInput = GetWithholdingTaxData['query']

export type WithholdingTaxBracketOutput = TaxBracket

export type WithholdingTaxOutput = WithholdingTaxResult
