import { StateLifeCycle } from '@island.is/application/types'
import { getHousingBenefitsPruneMessage } from './notifications'
import { getHousingBenefitsPruneDate } from './pruneUtils'

/**
 * Prunes applications 45 days after first entering draft (or no-rental-agreement).
 * The anchor timestamp is stored in answers.draftEnteredAt via a state entry action.
 */
export const housingBenefitsPruneLifecycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: getHousingBenefitsPruneDate,
  pruneMessage: getHousingBenefitsPruneMessage,
}

export {
  DRAFT_ENTERED_AT_KEY,
  DRAFT_PRUNE_DAYS,
  getHousingBenefitsPruneDate,
} from './pruneUtils'
