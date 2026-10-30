import type { ChildBenefitResult } from '../../../../gen/fetch'
import { rskRatioToPercent } from '../../utils/rskRatioToPercent'
import type { ChildBenefitOutput } from './definition'

export const toChildBenefitOutput = (
  result: ChildBenefitResult,
): ChildBenefitOutput => ({
  ...result,
  skerdingarhlutfall: rskRatioToPercent(result.skerdingarhlutfall),
  umframskerdingarhlutfall: rskRatioToPercent(result.umframskerdingarhlutfall),
  skerdingarhlutfallUndir7ara: rskRatioToPercent(
    result.skerdingarhlutfallUndir7ara,
  ),
})
