import { useSubmitting } from '@island.is/react-spa/shared'

import { getIntentSync } from '../utils/getIntent'

/**
 * This hook is used to determine if a form intent is currently being submitted or loaded.
 */
export const useIntent = <Intent extends string>(intent?: Intent) => {
  const { isLoading, isSubmitting, formData } = useSubmitting()
  const currentIntent = formData?.get('intent') as Intent
  const isCurrent = currentIntent
    ? intent === getIntentSync(currentIntent).intent
    : false

  return {
    intent,
    isCurrent,
    loading: isCurrent && (isLoading || isSubmitting),
    currentIntent,
  }
}
