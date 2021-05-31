import { Button, dynamicColor, font } from '@island.is/island-ui-native'
import {
  authenticateAsync,
  AuthenticationType,
  isEnrolledAsync,
} from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'
import { AppState, Platform, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'
import { Illustration } from './illustration'

const Title = styled.Text`
  ${font({
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 28,
  })}
  text-align: center;
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 64px;
`

const ButtonContainer = styled.View`
  margin-bottom: 32px;
`

const CancelButton = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${dynamicColor(({  theme }) => theme.color.blue400)};
`

const CancelText = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 16,
    color: (props) => props.theme.color.blue400,
  })}
`

export function useBiometricType(type: AuthenticationType[]) {
  const intl = useIntl()
  if (type.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    if (Platform.OS === 'ios') {
      return intl.formatMessage({ id: 'onboarding.biometrics.type.faceId' })
    } else {
      return intl.formatMessage({
        id: 'onboarding.biometrics.type.facialRecognition',
      })
    }
  } else if (type.includes(AuthenticationType.FINGERPRINT)) {
    return intl.formatMessage({ id: 'onboarding.biometrics.type.fingerprint' })
  } else if (type.includes(AuthenticationType.IRIS)) {
    return intl.formatMessage({ id: 'onboarding.biometrics.type.iris' })
  }

  return ''
}

export const OnboardingBiometricsScreen: NavigationFunctionComponent<{
  hasHardware: boolean
  isEnrolled: boolean
  supportedAuthenticationTypes: AuthenticationType[]
}> = (props) => {
  const [isEnrolled, setIsEnrolled] = useState(props.isEnrolled)
  const { setUseBiometrics } = usePreferencesStore()
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
        setUseBiometrics(true)
        preferencesStore.setState(() => ({ hasOnboardedBiometrics: true }))
        nextOnboardingStep()
      }
    })
  }

  const onCancelPress = () => {
    preferencesStore.setState(() => ({ hasOnboardedBiometrics: true }))
    nextOnboardingStep()
  }

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_ONBOARDING_BIOMETRICS}>
      <Illustration />
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Title>
          {isEnrolled ? (
            <FormattedMessage
              id="onboarding.biometrics.title"
              values={{ biometricType }}
            />
          ) : (
            <FormattedMessage
              id="onboarding.biometrics.notEnrolled"
              values={{ biometricType }}
            />
          )}
        </Title>
        <ButtonContainer>
          <Button
            testID={testIDs.ONBOARDING_BIOMETRICS_USE_BUTTON}
            title={intl.formatMessage(
              { id: 'onboarding.biometrics.useBiometricsButtonText' },
              { biometricType },
            )}
            onPress={onBiometricsPress}
            disabled={!isEnrolled}
          />
        </ButtonContainer>
        <CancelButton
          onPress={onCancelPress}
          testID={testIDs.ONBOARDING_BIOMETRICS_CANCEL_BUTTON}
        >
          <CancelText>
            <FormattedMessage id="onboarding.biometrics.skipButtonText" />
          </CancelText>
        </CancelButton>
      </SafeAreaView>
    </View>
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
