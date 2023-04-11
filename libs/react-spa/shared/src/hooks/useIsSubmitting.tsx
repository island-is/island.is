import { useNavigation } from 'react-router-dom'

/**
 * This hook is meant to be used with react-router when you want loading state when submitting a form.
 * Returns true if route action is being called due to a form submission and if loaders are being called to render the next page
 */
export const useIsSubmitting = (onlySubmitting = false) => {
  const navigation = useNavigation()
  // A route action is being called due to a form submission using POST, PUT, PATCH, or DELETE
  const isSubmitting = navigation.state === 'submitting'

  if (onlySubmitting) {
    return isSubmitting
  }

  // The loaders for the next routes are being called to render the next page
  const isLoading = navigation.state === 'loading'

  return isSubmitting || isLoading
}
