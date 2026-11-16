import type { WithholdingTaxInput } from '@island.is/clients/rsk/calculators'
import {
  HjuskaparstadaStadgreidsla,
  LaunGreidast,
  Manudur,
} from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import { numberAt, requireNumberAt, requireOptionAt } from '../validation'

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
  launamanudur: requireOptionAt(values, 'launamanudur', Object.values(Manudur)),
  laun: requireNumberAt(values, 'laun'),
  lifeyrissjodurHlutfall: requireNumberAt(values, 'lifeyrissjodurHlutfall'),
  sereignHlutfall: numberAt(values, 'sereignHlutfall'),
  nytingSkattkorts: requireNumberAt(values, 'nytingSkattkorts'),
  nytingSkattkortsMaka: numberAt(values, 'nytingSkattkortsMaka'),
  uppsafnadurPersonuafslattur: numberAt(values, 'uppsafnadurPersonuafslattur'),
  orlof: numberAt(values, 'orlof'),
  stettarfelag: numberAt(values, 'stettarfelag'),
  annad: numberAt(values, 'annad'),
  motframlagLifeyrissjodur: numberAt(values, 'motframlagLifeyrissjodur'),
  okutaekjastyrkurUtan: numberAt(values, 'okutaekjastyrkurUtan'),
  idgjaldSlysatryggingSjomanna: numberAt(
    values,
    'idgjaldSlysatryggingSjomanna',
  ),
})
