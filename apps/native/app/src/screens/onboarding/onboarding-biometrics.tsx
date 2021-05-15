import { Button } from '@island.is/island-ui-native'
import {
  authenticateAsync,
  AuthenticationType,
  isEnrolledAsync,
} from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'
import { AppState, Image, Platform, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import image from '../../assets/illustrations/digital-services-m1.png'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'

const Illustration = styled.SafeAreaView`
  background-color: ${(props) => props.theme.color.blue100};
  align-items: center;
  max-height: 40%;
  height: 300px;
`

const Title = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: ${(props) => props.theme.color.dark400};
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 64px;
`

const ButtonContainer = styled.View`
  margin-bottom: 32px;
`

const CancelButton = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
`

const CancelText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.color.blue400};
`

function useBiometricType(type: AuthenticationType[]) {
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
    <View style={{ flex: 1 }}>
      <Illustration>
        <Image
          source={image}
          style={{
            marginTop: -20,
            marginRight: -40,
            height: '120%',
          }}
          resizeMode="contain"
        />
      </Illustration>
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
            title={intl.formatMessage(
              { id: 'onboarding.biometrics.useBiometricsButtonText' },
              { biometricType },
            )}
            onPress={onBiometricsPress}
            disabled={!isEnrolled}
          />
        </ButtonContainer>
        <CancelButton onPress={onCancelPress}>
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
}
