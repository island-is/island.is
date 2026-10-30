import type { WithholdingTaxInput } from '@island.is/clients/rsk/calculators'
import {
  HjuskaparstadaStadgreidsla,
  LaunGreidast,
} from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import { requireNumberAt, requireOptionAt } from '../validation'

export const toWithholdingTaxInput = (
  values: SubmittedValues,
): WithholdingTaxInput => ({
  launGreidast: requireOptionAt(
    values,
    'launGreidast',
    Object.values(LaunGreidast),
  ),
  hjuskaparstada: requireOptionAt(
    values,
    'hjuskaparstada',
    Object.values(HjuskaparstadaStadgreidsla),
  ),
  tekjuar: requireNumberAt(values, 'tekjuar'),
  launamanudur: requireNumberAt(values, 'launamanudur'),
  laun: requireNumberAt(values, 'laun'),
  lifeyrissjodurHlutfall: requireNumberAt(values, 'lifeyrissjodurHlutfall'),
  sereignHlutfall: requireNumberAt(values, 'sereignHlutfall'),
  nytingSkattkorts: requireNumberAt(values, 'nytingSkattkorts'),
  nytingSkattkortsMaka: requireNumberAt(values, 'nytingSkattkortsMaka'),
  uppsafnadurPersonuafslattur: requireNumberAt(
    values,
    'uppsafnadurPersonuafslattur',
  ),
  orlof: requireNumberAt(values, 'orlof'),
  stettarfelag: requireNumberAt(values, 'stettarfelag'),
  annad: requireNumberAt(values, 'annad'),
  motframlagLifeyrissjodur: requireNumberAt(values, 'motframlagLifeyrissjodur'),
  okutaekjastyrkurUtan: requireNumberAt(values, 'okutaekjastyrkurUtan'),
  idgjaldSlysatryggingSjomanna: requireNumberAt(
    values,
    'idgjaldSlysatryggingSjomanna',
  ),
})
