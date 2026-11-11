import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Alert } from 'react-native'

import { ElectronicIdConfirmation } from '@/components/device-bound-auth/electronic-id-confirmation'
import { useBiometricType } from '@/hooks/use-biometric-type'
import { useUiStore } from '@/stores/ui-store'

export default function ElectronicIdPreview() {
  const router = useRouter()
  const { purpose = 'unlock' } = useLocalSearchParams<{
    purpose?: 'unlock' | 'enableBiometrics'
  }>()
  const { authenticationTypes } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)

  return (
    <ElectronicIdConfirmation
      purpose={purpose}
      biometricType={biometricType.text}
      verificationCode="4721"
      onCancelPress={() => router.back()}
      onAuthenticatorAppPress={() =>
        Alert.alert('Preview', 'Would hand over to the Auðkenni app.')
      }
    />
  )
}
