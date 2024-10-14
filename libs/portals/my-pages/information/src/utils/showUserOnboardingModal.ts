import { GetUserProfileQuery } from '../components/PersonalInformation/UserOnboarding/UserOnboarding.generated'

export const onboardingModalStorage = {
  key: 'ONBOARDING_MODAL',
  value: 'HIDDEN',
}

export const hideModalWithQueryParam = (): boolean => {
  try {
    const url = new URL(document.URL)
    const urlSearchParams = url.searchParams ?? ''
    const queryParam = decodeURI(
      urlSearchParams.get('hide_onboarding_modal') ?? '',
    )

    const shouldHideModal = queryParam === 'true'

    if (shouldHideModal) {
      sessionStorage.setItem(
        onboardingModalStorage.key,
        onboardingModalStorage.value,
      )
    }

    return shouldHideModal
  } catch {
    return false
  }
}

export const showUserOnboardingModal = (
  getUserProfile: GetUserProfileQuery['getUserProfile'] | undefined | null,
) => {
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

  return getUserProfile.needsNudge !== false
}
