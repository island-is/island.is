import { useNavigation } from 'react-router-dom'

export type UseIsSubmitting = {
  /**
   * The loaders for the next routes are being called to render the next page
   */
  isLoading: boolean
  /**
   * A route action is being called due to a form submission using POST, PUT, PATCH, or DELETE
   */
  isSubmitting: boolean
  formData?: FormData
}

/**
 * This hook is meant to be used with react-router when you want loading state when submitting a form.
 * Returns true if route action is being called due to a form submission and if loaders are being called to render the next page
 */
export const useSubmitting = (): UseIsSubmitting => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const isLoading = navigation.state === 'loading'

  return {
    isLoading: isLoading,
    isSubmitting: isSubmitting,
    formData: navigation.formData,
  }
}
