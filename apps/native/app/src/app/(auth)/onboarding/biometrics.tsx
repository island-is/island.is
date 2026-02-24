import {
  AuthenticationType,
  authenticateAsync,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { AppState, Platform } from 'react-native'

import { Button, CancelButton, Illustration, Onboarding } from '@/ui'
import finger from '@/assets/icons/finger-16.png'
import iris from '@/assets/icons/iris-16.png'
import { preferencesStore } from '@/stores/preferences-store'
import { nextOnboardingStep } from '@/utils/onboarding'

function useBiometricType(types: AuthenticationType[]) {
  const intl = useIntl()
  if (types.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    return Platform.OS === 'ios'
      ? { text: intl.formatMessage({ id: 'onboarding.biometrics.type.faceId' }), icon: iris }
      : { text: intl.formatMessage({ id: 'onboarding.biometrics.type.biometrics' }), icon: iris }
  } else if (types.includes(AuthenticationType.FINGERPRINT)) {
    return Platform.OS === 'ios'
      ? { text: intl.formatMessage({ id: 'onboarding.biometrics.type.fingerprint' }), icon: finger }
      : { text: intl.formatMessage({ id: 'onboarding.biometrics.type.biometrics' }), icon: finger }
  } else if (types.includes(AuthenticationType.IRIS)) {
    return { text: intl.formatMessage({ id: 'onboarding.biometrics.type.iris' }), icon: iris }
  }
  return { text: intl.formatMessage({ id: 'onboarding.biometrics.type.biometrics' }), icon: undefined }
}

export default function BiometricsScreen() {
  const intl = useIntl()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [authTypes, setAuthTypes] = useState<AuthenticationType[]>([])
  const biometricType = useBiometricType(authTypes)

  useEffect(() => {
    Promise.all([
      isEnrolledAsync(),
      supportedAuthenticationTypesAsync(),
    ]).then(([enrolled, types]) => {
      setIsEnrolled(enrolled)
      setAuthTypes(types)
    })

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        isEnrolledAsync().then(setIsEnrolled)
      }
    })

    return () => subscription.remove()
  }, [])

  const onBiometricsPress = () => {
    authenticateAsync().then((result) => {
      if (result.success) {
        preferencesStore.setState({
          hasOnboardedBiometrics: true,
          hasAcceptedBiometrics: true,
          useBiometrics: true,
        })
        nextOnboardingStep()
      }
    })
  }

  const onSkipPress = () => {
    preferencesStore.setState({ hasOnboardedBiometrics: true })
    nextOnboardingStep()
  }

  return (
    <Onboarding
      illustration={<Illustration />}
      title={
        isEnrolled ? (
          <FormattedMessage
            id="onboarding.biometrics.title"
            values={{ biometricType: biometricType.text }}
          />
        ) : (
          <FormattedMessage
            id="onboarding.biometrics.notEnrolled"
            values={{ biometricType: biometricType.text }}
          />
        )
      }
      buttonSubmit={
        <Button
          title={intl.formatMessage(
            { id: 'onboarding.biometrics.useBiometricsButtonText' },
            { biometricType: biometricType.text },
          )}
          onPress={onBiometricsPress}
          disabled={!isEnrolled}
          icon={biometricType.icon}
        />
      }
      buttonCancel={
        <CancelButton
          title={<FormattedMessage id="onboarding.biometrics.skipButtonText" />}
          onPress={onSkipPress}
        />
      }
    />
  )
}
