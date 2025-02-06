import { SocialInsuranceIncomePlanStatus } from '@island.is/api/schema'
import { ApplicationStatus, Status } from './types'

const checkCompletedIsEligible = (
  status:
    | SocialInsuranceIncomePlanStatus.ACCEPTED
    | SocialInsuranceIncomePlanStatus.CANCELLED,
  eligibleForChange?: boolean,
): Status => {
  if (status === SocialInsuranceIncomePlanStatus.ACCEPTED) {
    return eligibleForChange ? 'accepted' : 'accepted_no_changes'
  }
  return eligibleForChange ? 'rejected' : 'rejected_no_changes'
}

export const mapStatus = (
  status?: SocialInsuranceIncomePlanStatus,
  applicationStatus?: ApplicationStatus,
  eligibleForChange?: boolean,
): Status => {
  if (!status && !applicationStatus) {
    return 'no_data'
  }
  //no data from service provider
  switch (applicationStatus) {
    //application is being worked on in application system
    case 'draft': {
      switch (status) {
        case SocialInsuranceIncomePlanStatus.IN_PROGRESS:
          // Not allowed to draft an application if the service provider is reviewing one already
          // ignore the application system if so
          return 'in_review'
        default:
          // The application is being worked on, doesn't matter what the service provider responds with
          return 'in_progress'
      }
    }
    //Application system has submitted the application, or the service provider has received it
    case 'tryggingastofnunSubmitted':
    case 'tryggingastofnunInReview': {
      return 'in_review'
    }
    case 'completed': {
      switch (status) {
        case SocialInsuranceIncomePlanStatus.IN_PROGRESS: {
          //this shouldn't happen, but just return in_review since the service provider says it is
          return 'in_review'
        }
        case SocialInsuranceIncomePlanStatus.CANCELLED:
        case SocialInsuranceIncomePlanStatus.ACCEPTED: {
          return checkCompletedIsEligible(status, eligibleForChange)
        }
        default: {
          // Something went wrong. Application system reports the application being done
          //  but the service provider has no data
          return 'error'
        }
      }
    }
    default:
      //return whatever the service provider if application system returns nothing
      switch (status) {
        case SocialInsuranceIncomePlanStatus.IN_PROGRESS: {
          return 'in_review'
        }
        case SocialInsuranceIncomePlanStatus.CANCELLED:
        case SocialInsuranceIncomePlanStatus.ACCEPTED: {
          return checkCompletedIsEligible(status, eligibleForChange)
        }
        default: {
          return 'no_data'
        }
      }
  }
}
