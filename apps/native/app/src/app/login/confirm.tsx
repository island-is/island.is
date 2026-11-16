import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'

import { ElectronicIdConfirmation } from '@/components/device-bound-auth/electronic-id-confirmation'
import { isCancelled } from '@/hooks/use-electronic-id-unlock'
import { getIasClient } from '@/lib/ias'
import {
  nativeLoginStore,
  toLoginError,
  useNativeLoginStore,
} from '@/lib/native-login'
import { authStore } from '@/stores/auth-store'
import { nextOnboardingStep } from '@/utils/onboarding'

/**
 * Waits while the person approves the login on their phone. Going back
 * cancels it; a refusal goes back to the number with the reason.
 */
export default function LoginConfirmScreen() {
  const router = useRouter()
  const request = useNativeLoginStore(({ request }) => request)

  useEffect(() => {
    if (!request) {
      router.back()
      return
    }
    const controller = new AbortController()
    getIasClient()
      .waitForApproval(request, { signal: controller.signal })
      .then(async (tokens) => {
        await authStore.getState().loginNative(tokens)
        nativeLoginStore.setState({ loginHint: '', request: undefined })
        await nextOnboardingStep()
      })
      .catch((error) => {
        if (isCancelled(error)) {
          return
        }
        console.warn('Native login failed', error)
        nativeLoginStore.setState({ error: toLoginError(error) })
        router.back()
      })
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request])

  return (
    <ElectronicIdConfirmation
      purpose="login"
      verificationCode={request?.verificationCode ?? ''}
      onCancelPress={() => router.back()}
    />
  )
}
