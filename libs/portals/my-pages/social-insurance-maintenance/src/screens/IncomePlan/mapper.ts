import { SocialInsuranceIncomePlanStatus } from '@island.is/api/schema'
import { ApplicationStatus, Status } from './types'

export const mapStatus = (
  status?: SocialInsuranceIncomePlanStatus,
  applicationStatus?: ApplicationStatus,
  eligibleForChange?: boolean,
): Status => {
  if (!status && !applicationStatus) {
    return 'no_data'
  }
  //no data from service provider
  switch (status) {
    case SocialInsuranceIncomePlanStatus.IN_PROGRESS: {
      return 'in_review'
    }
    case SocialInsuranceIncomePlanStatus.CANCELLED: {
      switch (applicationStatus) {
        case 'draft': {
          return 'in_progress'
        }
        case 'completed': {
          return 'accepted'
        }
        case 'tryggingastofnunSubmitted':
        case 'tryggingastofnunInReview': {
          return 'in_review'
        }
        default: {
          return eligibleForChange === false
            ? 'rejected_no_changes'
            : 'rejected'
        }
      }
    }
    case SocialInsuranceIncomePlanStatus.ACCEPTED: {
      switch (applicationStatus) {
        case 'draft': {
          return 'in_progress'
        }
        case 'completed': {
          return 'accepted'
        }
        case 'tryggingastofnunSubmitted':
        case 'tryggingastofnunInReview': {
          return 'in_review'
        }
        default: {
          return eligibleForChange === false
            ? 'accepted_no_changes'
            : 'accepted'
        }
      }
    }
    default:
      switch (applicationStatus) {
        case 'completed': {
          //shouldn't happen
          return 'unknown'
        }
        case 'tryggingastofnunSubmitted':
        case 'tryggingastofnunInReview': {
          return 'in_review'
        }
        default:
          return 'no_data'
      }
  }
}
