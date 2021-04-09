import { Button, Input, SwitchLabel } from '@island.is/island-ui-native'
import {
  authenticateAsync,
  supportedAuthenticationTypesAsync,
  AuthenticationType,
  isEnrolledAsync,
} from 'expo-local-authentication'
import React, { useEffect, useState } from 'react'
import { Switch, Keyboard } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components'
import { OnBoarding } from '../../components/onboarding/onboarding'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'

export const OnboardingAppLockScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  const theme = useTheme()
  const { useBiometrics, setUseBiometrics } = usePreferencesStore()
  const [hasBiometrics, setHasBiometrics] = useState(false)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinMatches, setPinMatches] = useState(false)

  const onBiometricsPress = () => {
    if (!hasBiometrics) {
      return
    }

    if (useBiometrics) {
      setUseBiometrics(false)
      return
    }

    // check to see if we want to prompt
    authenticateAsync().then((authenticate) => {
      if (authenticate.success) {
        setUseBiometrics(true)
      }
    })
  }

  const onContinuePress = () => {
    preferencesStore.setState(() => ({ hasOnboardedPinCode: true }))
    return nextOnboardingStep()
  }

  useEffect(() => {
    supportedAuthenticationTypesAsync().then((supportedAuthenticationTypes) => {
      if (
        supportedAuthenticationTypes.includes(
          AuthenticationType.FACIAL_RECOGNITION,
        )
      ) {
        isEnrolledAsync().then((isEnrolled) => {
          if (isEnrolled) {
            setHasBiometrics(true)
          }
        })
      }
    })
  }, [])

  useEffect(() => {
    if (pin === confirmPin && pin.length > 3) {
      setPinMatches(true)
      Keyboard.dismiss()
    } else {
      setPinMatches(false)
    }
  }, [pin, confirmPin])

  return (
    <OnBoarding
      testID={testIDs.SCREEN_ONBOARDING_APP_LOCK}
      title="Setja upp skjálæsingu"
      copy="Veldu þér PIN númer á milli 4-16 tölustafi til þess að aflæsa appinu."
      action={
        <Button
          testID={testIDs.ONBOARDING_APP_LOCK_CONTINUE_BUTTON}
          onPress={onContinuePress}
          title="Halda áfram"
          disabled={!pinMatches}
        />
      }
    >
      <SwitchLabel title="Nota FaceID" onPress={onBiometricsPress}>
        <Switch
          trackColor={{ false: theme.color.dark100, true: theme.color.blue400 }}
          thumbColor={useBiometrics ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onBiometricsPress}
          value={useBiometrics}
          disabled={!hasBiometrics}
        />
      </SwitchLabel>

      <Input
        onChangeText={(text) => setPin(text)}
        placeholder="Leyninúmer"
        keyboardType="number-pad"
        secureTextEntry={true}
        returnKeyType="next"
        testID={testIDs.ENTER_PIN_NUMBER_INPUT}
      />
      <Input
        onChangeText={(text) => setConfirmPin(text)}
        placeholder="Staðfesta leyninúmer"
        keyboardType="number-pad"
        secureTextEntry={true}
        testID={testIDs.CONFIRM_PIN_NUMBER_INPUT}
      />
    </OnBoarding>
  )
}

OnboardingAppLockScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
}
