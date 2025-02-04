import { SocialInsuranceIncomePlanStatus } from '@island.is/api/schema'
import { ApplicationStatus, Status } from './types'

export const mapStatus = (
  status?: SocialInsuranceIncomePlanStatus,
  applicationStatus?: ApplicationStatus,
): Status => {
  if (!status && !applicationStatus) {
    return 'no_data'
  }
  //no data from service provider
  switch (status) {
    case SocialInsuranceIncomePlanStatus.UNKNOWN: {
      switch (applicationStatus) {
        case 'draft': {
          return 'in_progress'
        }
        case 'completed': {
          //shouldn't happen
          return 'unknown'
        }
        case 'tryggingastofnunSubmitted':
        case 'tryggingastofnunInReview': {
          return 'in_review'
        }
        default:
          return 'unknown'
      }
    }
    case SocialInsuranceIncomePlanStatus.IN_PROGRESS: {
      return 'in_progress'
    }
    case SocialInsuranceIncomePlanStatus.CANCELLED: {
      switch (applicationStatus) {
        case 'draft': {
          return 'in_progress'
        }
        case 'completed': {
          //shouldn't happen
          return 'rejected'
        }
        case 'tryggingastofnunSubmitted':
        case 'tryggingastofnunInReview': {
          return 'in_review'
        }
        default:
          return 'unknown'
      }
    }
    case SocialInsuranceIncomePlanStatus.ACCEPTED: {
      switch (applicationStatus) {
        case 'draft': {
          return 'in_progress'
        }
        case 'completed': {
          //shouldn't happen
          return 'accepted'
        }
        case 'tryggingastofnunSubmitted':
        case 'tryggingastofnunInReview': {
          return 'in_review'
        }
        default:
          return 'unknown'
      }
    }
    default:
      switch (applicationStatus) {
        case 'draft': {
          return 'in_progress'
        }
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
