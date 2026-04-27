import { authenticateAsync, isEnrolledAsync } from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { AppState } from 'react-native'

import { Button, Onboarding } from '@/ui'
import allow from '@/assets/icons/allow.png'
import onboardingBiometrics from '@/assets/illustrations/onboarding-biometrics.png'
import { preferencesStore } from '@/stores/preferences-store'
import { nextOnboardingStep } from '@/utils/onboarding'

export default function BiometricsScreen() {
  const intl = useIntl()
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    isEnrolledAsync().then(setIsEnrolled)

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
      illustration={onboardingBiometrics}
      title={<FormattedMessage id="onboarding.biometrics.title" />}
      body={<FormattedMessage id="onboarding.biometrics.body" />}
      buttonSubmit={
        <Button
          title={intl.formatMessage({
            id: 'onboarding.biometrics.useBiometricsButtonText',
          })}
          onPress={onBiometricsPress}
          disabled={!isEnrolled}
          icon={allow}
        />
      }
      buttonCancel={
        <Button
          title={intl.formatMessage({
            id: 'onboarding.biometrics.skipButtonText',
          })}
          isOutlined
          onPress={onSkipPress}
        />
      }
    />
  )
}
