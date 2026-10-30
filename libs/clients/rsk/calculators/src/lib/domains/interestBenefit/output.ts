import type { InterestBenefitResult } from '../../../../gen/fetch'
import { rskRatioToPercent } from '../../utils/rskRatioToPercent'
import type { InterestBenefitOutput } from './definition'

export const toInterestBenefitOutput = (
  result: InterestBenefitResult,
): InterestBenefitOutput => ({
  ...result,
  tekjuskerdingarhlutfall: rskRatioToPercent(result.tekjuskerdingarhlutfall),
  skuldaskerdingarhlutfall: rskRatioToPercent(result.skuldaskerdingarhlutfall),
  eignaskerdingarhlutfall: rskRatioToPercent(result.eignaskerdingarhlutfall),
})
