import {
  AuthenticationType,
  authenticateAsync,
  isEnrolledAsync,
} from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { AppState, Platform } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'

import { Button, CancelButton, Illustration, Onboarding } from '../../ui'
import finger from '../../assets/icons/finger-16.png'
import iris from '../../assets/icons/iris-16.png'
import { preferencesStore } from '../../stores/preferences-store'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'

export function useBiometricType(type: AuthenticationType[] = []) {
  const intl = useIntl()
  if (type.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    if (Platform.OS === 'ios') {
      return {
        text: intl.formatMessage({ id: 'onboarding.biometrics.type.faceId' }),
        icon: iris,
      }
    } else {
      return {
        text: intl.formatMessage({
          id: 'onboarding.biometrics.type.biometrics',
        }),
        icon: iris,
      }
    }
  } else if (type.includes(AuthenticationType.FINGERPRINT)) {
    if (Platform.OS === 'ios') {
      return {
        text: intl.formatMessage({
          id: 'onboarding.biometrics.type.fingerprint',
        }),
        icon: finger,
      }
    } else {
      return {
        text: intl.formatMessage({
          id: 'onboarding.biometrics.type.biometrics',
        }),
        icon: finger,
      }
    }
  } else if (type.includes(AuthenticationType.IRIS)) {
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

export const OnboardingBiometricsScreen: NavigationFunctionComponent<{
  hasHardware: boolean
  isEnrolled: boolean
  supportedAuthenticationTypes: AuthenticationType[]
}> = (props) => {
  const [isEnrolled, setIsEnrolled] = useState(props.isEnrolled)
  const biometricType = useBiometricType(props.supportedAuthenticationTypes)
  const intl = useIntl()

  useEffect(() => {
    // check screen active states
    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        // user may be coming back from settings where they were trying to
        // enroll into biometrics.
        isEnrolledAsync().then(setIsEnrolled)
      }
    })
  }, [])

  const onBiometricsPress = () => {
    // check to see if we want to prompt
    authenticateAsync().then((authenticate) => {
      if (authenticate.success) {
        preferencesStore.setState(() => ({
          hasOnboardedBiometrics: true,
          hasAcceptedBiometrics: true,
          useBiometrics: true,
        }))
        nextOnboardingStep()
      }
    })
  }

  const onCancelPress = () => {
    preferencesStore.setState(() => ({ hasOnboardedBiometrics: true }))
    nextOnboardingStep()
  }

  return (
    <Onboarding
      testID={testIDs.SCREEN_ONBOARDING_BIOMETRICS}
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
      illustration={<Illustration />}
      buttonSubmit={
        <Button
          testID={testIDs.ONBOARDING_BIOMETRICS_USE_BUTTON}
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
          onPress={onCancelPress}
          testID={testIDs.ONBOARDING_BIOMETRICS_CANCEL_BUTTON}
        />
      }
    />
  )
}

OnboardingBiometricsScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    orientation: ['portrait'],
  },
}
