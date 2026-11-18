import {
  AuthenticationType,
  hasHardwareAsync,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { AppState, Linking, Platform } from 'react-native'

import { Button, Onboarding } from '@/ui'
import { ElectronicIdConfirmation } from '@/components/device-bound-auth/electronic-id-confirmation'
import { useEnableBiometrics } from '@/hooks/use-enable-biometrics'
import finger from '@/assets/icons/finger-16.png'
import iris from '@/assets/icons/iris-16.png'
import onboardingBiometrics from '@/assets/illustrations/onboarding-biometrics.png'
import { preferencesStore } from '@/stores/preferences-store'
import { nextOnboardingStep } from '@/utils/onboarding'

function useBiometricType(types: AuthenticationType[]) {
  const intl = useIntl()
  if (types.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    return Platform.OS === 'ios'
      ? {
          text: intl.formatMessage({ id: 'onboarding.biometrics.type.faceId' }),
          icon: iris,
        }
      : {
          text: intl.formatMessage({
            id: 'onboarding.biometrics.type.biometrics',
          }),
          icon: iris,
        }
  } else if (types.includes(AuthenticationType.FINGERPRINT)) {
    return Platform.OS === 'ios'
      ? {
          text: intl.formatMessage({
            id: 'onboarding.biometrics.type.fingerprint',
          }),
          icon: finger,
        }
      : {
          text: intl.formatMessage({
            id: 'onboarding.biometrics.type.biometrics',
          }),
          icon: finger,
        }
  } else if (types.includes(AuthenticationType.IRIS)) {
    return {
      text: intl.formatMessage({ id: 'onboarding.biometrics.type.iris' }),
      icon: iris,
    }
  }
  return {
    text: intl.formatMessage({ id: 'onboarding.biometrics.type.biometrics' }),
    icon: undefined,
  }
}

export default function BiometricsScreen() {
  const intl = useIntl()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [authTypes, setAuthTypes] = useState<AuthenticationType[]>([])
  const [hasHardware, setHasHardware] = useState(true)
  const biometricType = useBiometricType(authTypes)
  // iOS says there's no hardware also when the person has turned biometrics
  // off for this app in the phone's settings. The type is still known then.
  const isTurnedOff =
    Platform.OS === 'ios' && authTypes.length > 0 && !hasHardware
  // The electronic ID approval is shown in place of this step.
  const { isEnabling, enableBiometrics, verificationCode, cancelElectronicId } =
    useEnableBiometrics({ inline: true })

  useEffect(() => {
    Promise.all([
      isEnrolledAsync(),
      supportedAuthenticationTypesAsync(),
      hasHardwareAsync(),
    ]).then(([enrolled, types, hardware]) => {
      setIsEnrolled(enrolled)
      setAuthTypes(types)
      setHasHardware(hardware)
    })

    // Also back from the phone's settings, with biometrics turned on there.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        isEnrolledAsync().then(setIsEnrolled)
        hasHardwareAsync().then(setHasHardware)
      }
    })

    return () => subscription.remove()
  }, [])

  // Biometrics are a key registered with IAS, which takes an electronic ID
  // approval first.
  const onBiometricsPress = async () => {
    if (await enableBiometrics()) {
      preferencesStore.setState({ hasOnboardedBiometrics: true })
      nextOnboardingStep()
    }
  }

  const onSkipPress = () => {
    preferencesStore.setState({ hasOnboardedBiometrics: true })
    nextOnboardingStep()
  }

  if (verificationCode !== undefined) {
    return (
      <ElectronicIdConfirmation
        purpose="enableBiometrics"
        fullScreen
        biometricType={biometricType.text}
        verificationCode={verificationCode}
        onCancelPress={cancelElectronicId}
      />
    )
  }

  const skipButton = (
    <Button
      title={intl.formatMessage({
        id: 'onboarding.biometrics.skipButtonText',
      })}
      isOutlined
      onPress={onSkipPress}
    />
  )

  if (isTurnedOff) {
    return (
      <Onboarding
        illustration={onboardingBiometrics}
        title={
          <FormattedMessage
            id="onboarding.biometrics.turnedOffTitle"
            values={{ biometricType: biometricType.text }}
          />
        }
        body={
          <FormattedMessage
            id="onboarding.biometrics.turnedOffBody"
            values={{ biometricType: biometricType.text }}
          />
        }
        buttonSubmit={
          <Button
            title={intl.formatMessage({
              id: 'onboarding.biometrics.openSettingsButton',
            })}
            onPress={() => void Linking.openSettings()}
          />
        }
        buttonCancel={skipButton}
      />
    )
  }

  return (
    <Onboarding
      illustration={onboardingBiometrics}
      title={<FormattedMessage id="onboarding.biometrics.title" />}
      body={
        isEnrolled ? (
          <FormattedMessage
            id="onboarding.biometrics.bodyWithoutPin"
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
          loading={isEnabling}
          icon={biometricType.icon}
        />
      }
      buttonCancel={skipButton}
    />
  )
}
