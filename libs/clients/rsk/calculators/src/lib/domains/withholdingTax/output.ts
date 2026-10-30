import type { WithholdingTaxResult } from '../../../../gen/fetch'
import { rskRatioToPercent } from '../../utils/rskRatioToPercent'
import type { WithholdingTaxOutput } from './definition'

export const toWithholdingTaxOutput = (
  result: WithholdingTaxResult,
): WithholdingTaxOutput => ({
  ...result,
  lifeyrisjodurProsenta: rskRatioToPercent(result.lifeyrisjodurProsenta),
  sereignProsenta: rskRatioToPercent(result.sereignProsenta),
  stadgreidsluhlutfall: rskRatioToPercent(result.stadgreidsluhlutfall),
  skattthrep: (Array.isArray(result.skattthrep) ? result.skattthrep : []).map(
    (bracket) => ({
      ...bracket,
      stadgreidsluhlutfall: rskRatioToPercent(bracket.stadgreidsluhlutfall),
    }),
  ),
})
