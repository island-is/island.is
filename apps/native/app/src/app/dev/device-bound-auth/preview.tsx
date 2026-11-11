import { authenticateAsync } from 'expo-local-authentication'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import onboardingBiometrics from '@/assets/illustrations/onboarding-biometrics.png'
import {
  DeviceLock,
  DeviceLockStatus,
} from '@/components/device-bound-auth/device-lock'
import { ReloginNotice } from '@/components/device-bound-auth/relogin-notice'
import { useBiometricType } from '@/hooks/use-biometric-type'
import { useUiStore } from '@/stores/ui-store'
import { Button, Onboarding } from '@/ui'

// Sample person from the designs, so previews never show a real one.
const name = 'Jón Jónsson'
const nationalId = '1908912399'

type Variant = 'relogin' | 'lock' | 'lock-electronic-id-only' | 'onboarding'

export default function DeviceBoundAuthPreview() {
  const router = useRouter()
  const intl = useIntl()
  const params = useLocalSearchParams<{
    variant?: Variant
    status?: DeviceLockStatus
  }>()
  const [status, setStatus] = useState<DeviceLockStatus>(
    params.status ?? 'idle',
  )
  const { authenticationTypes } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)

  const onBiometricsPress = async () => {
    setStatus('prompting')
    const result = await authenticateAsync({
      disableDeviceFallback: true,
      fallbackLabel: '',
      cancelLabel: intl.formatMessage({ id: 'biometrics.cancel' }),
    })
    if (result.success) {
      router.back()
    } else {
      setStatus('failed')
    }
  }

  const onElectronicIdPress = () => {
    router.push('/dev/device-bound-auth/electronic-id?purpose=unlock')
  }

  if (params.variant === 'relogin') {
    return <ReloginNotice onLoginPress={() => router.back()} />
  }

  if (params.variant === 'onboarding') {
    return (
      <Onboarding
        illustration={onboardingBiometrics}
        title={<FormattedMessage id="onboarding.biometrics.title" />}
        body={
          <FormattedMessage
            id="onboarding.biometrics.bodyWithoutPin"
            values={{ biometricType: biometricType.text }}
          />
        }
        buttonSubmit={
          <Button
            title={intl.formatMessage(
              { id: 'onboarding.biometrics.useBiometricsButtonText' },
              { biometricType: biometricType.text },
            )}
            onPress={() => router.back()}
          />
        }
        buttonCancel={
          <Button
            title={intl.formatMessage({
              id: 'onboarding.biometrics.skipButtonText',
            })}
            isOutlined
            onPress={() => router.back()}
          />
        }
      />
    )
  }

  return (
    <DeviceLock
      name={name}
      nationalId={nationalId}
      biometricType={
        params.variant === 'lock-electronic-id-only'
          ? undefined
          : biometricType.text
      }
      status={status}
      onBiometricsPress={onBiometricsPress}
      onElectronicIdPress={onElectronicIdPress}
      onLogoutPress={() => router.back()}
    />
  )
}
