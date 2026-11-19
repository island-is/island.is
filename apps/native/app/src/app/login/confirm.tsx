import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { BackHandler } from 'react-native'

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
  const navigation = useNavigation()
  const request = useNativeLoginStore(({ request }) => request)
  // Approved: the login is being finished and can't be cancelled any more,
  // or it would carry on behind the number screen.
  const [isFinishing, setIsFinishing] = useState(false)

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !isFinishing })
    if (!isFinishing) {
      return
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    )
    return () => subscription.remove()
  }, [isFinishing, navigation])

  // The request this screen opened with: clearing it from the store after
  // the login mustn't send this screen back.
  useEffect(() => {
    if (!request) {
      router.back()
      return
    }
    const controller = new AbortController()
    // Cancelled, so this screen is gone: an answer that comes anyway, e.g.
    // a renewal still out, mustn't log in or send the number screen back.
    const isCancelledHere = () => controller.signal.aborted
    getIasClient()
      .waitForApproval(request, { signal: controller.signal })
      .then(async (tokens) => {
        if (isCancelledHere()) {
          return
        }
        setIsFinishing(true)
        await authStore.getState().loginNative(tokens)
        await nextOnboardingStep()
        nativeLoginStore.setState({ loginHint: '', request: undefined })
      })
      .catch((error) => {
        if (isCancelled(error) || isCancelledHere()) {
          return
        }
        console.warn('Native login failed', error)
        setIsFinishing(false)
        nativeLoginStore.setState({ error: toLoginError(error) })
        router.back()
      })
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ElectronicIdConfirmation
      purpose="login"
      verificationCode={request?.verificationCode ?? ''}
      isFinishing={isFinishing}
      onCancelPress={() => router.back()}
    />
  )
}
