import { UserProfile } from '@island.is/api/schema'
import differenceInMonths from 'date-fns/differenceInMonths'

export const onboardingModalStorage = {
  key: 'ONBOARDING_MODAL',
  value: 'HIDDEN',
}

/**
 * MODIFIED_FALLBACK_TIME
 * This represents the date of the deployment of this feature.
 * It's used for displaying the modal at least 6 months from deployment.
 * For some use-cases we can have a user come in with email+tel, but no modification date.
 * When the user interacts with the modal, a modification date is set.
 */
const MODIFIED_FALLBACK_TIME = new Date('2022-04-01T00:00:00Z')

export const diffModifiedOverMaxDate = (modified: string | undefined) => {
  const modifiedProfileDate = modified ?? MODIFIED_FALLBACK_TIME
  const dateNow = new Date()
  const dateModified = new Date(modifiedProfileDate)
  const diffInMonths = differenceInMonths(dateNow, dateModified)
  const diffModifiedOverMaxDate = diffInMonths >= 6
  return diffModifiedOverMaxDate
}

export const hideModalWithQueryParam = (): boolean => {
  try {
    const url = new URL(document.URL)
    const urlSearchParams = url.searchParams ?? ''
    const encodedParam = encodeURI(
      urlSearchParams.get('hide_onboarding_modal') ?? '',
    )

    const shouldHide = encodedParam === 'true'
    return shouldHide
  } catch {
    return false
  }
}

export const showModal = (getUserProfile: UserProfile | undefined | null) => {
  if (!getUserProfile) {
    return false
  }

  const modalStorageValue = sessionStorage.getItem(onboardingModalStorage.key)
  const hasClosedInSession = modalStorageValue === onboardingModalStorage.value

  if (hasClosedInSession) {
    return false
  }

  const hideModalWithQueryParameters = hideModalWithQueryParam()

  if (hideModalWithQueryParameters) {
    return false
  }

  const userProfileEmail = getUserProfile.email
  const userProfileTel = getUserProfile.mobilePhoneNumber
  const hasEmailAndTel = userProfileEmail && userProfileTel

  const diffOverMax = diffModifiedOverMaxDate(getUserProfile.modified)

  return (!hasEmailAndTel && !getUserProfile.modified) || diffOverMax
}
