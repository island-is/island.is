import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect } from 'react'

import { ElectronicIdConfirmation } from '@/components/device-bound-auth/electronic-id-confirmation'
import { useBiometricType } from '@/hooks/use-biometric-type'
import {
  electronicIdStore,
  useElectronicIdStore,
} from '@/stores/electronic-id-store'
import { useUiStore } from '@/stores/ui-store'

/**
 * The verification code, in a sheet while the person approves the electronic
 * ID request on their phone. Closing the sheet any way cancels the request.
 */
export default function ElectronicIdScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const { purpose, verificationCode } = useElectronicIdStore()
  const { authenticationTypes } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)?.text

  // Closed from outside once the request has ended (closeElectronicIdSheet).
  // iOS can't take a sheet out from under another, so with the lock over it
  // this one goes once it's on top again, after the unlock.
  useEffect(() => {
    const { requestId } = electronicIdStore.getState()
    const closeIfOnTop = () => {
      if (
        electronicIdStore.getState().sheetRequestId !== requestId &&
        navigation.isFocused()
      ) {
        navigation.goBack()
      }
    }
    const unsubscribeStore = electronicIdStore.subscribe(closeIfOnTop)
    const unsubscribeFocus = navigation.addListener('focus', closeIfOnTop)
    return () => {
      unsubscribeStore()
      unsubscribeFocus()
    }
  }, [navigation])

  useEffect(() => {
    // The request this opened for, not one started after it closes.
    const { requestId, cancel } = electronicIdStore.getState()
    return () => {
      if (electronicIdStore.getState().sheetRequestId === requestId) {
        electronicIdStore.setState({ sheetRequestId: undefined })
      }
      // A no-op once the request has ended.
      cancel?.()
    }
  }, [])

  return (
    <ElectronicIdConfirmation
      purpose={purpose}
      biometricType={biometricType}
      verificationCode={verificationCode ?? ''}
      onCancelPress={() => router.back()}
    />
  )
}
