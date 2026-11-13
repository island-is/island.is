import { useRouter } from 'expo-router'
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
  const { purpose, verificationCode } = useElectronicIdStore()
  const { authenticationTypes } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)?.text

  useEffect(() => {
    // The request this sheet opened for, not one started after it closes.
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
