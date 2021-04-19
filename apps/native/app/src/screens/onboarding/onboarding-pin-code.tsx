import { SafeAreaView,View,Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation'
import { testIDs } from '../../utils/test-ids'
import styled from 'styled-components/native';
import logo from '../../assets/logo/logo-64w.png'
import { VisualizedPinCode } from '../../components/visualized-pin-code/visualized-pin-code'
import { PinKeypad } from '../../components/pin-keypad/pin-keypad'
import { ComponentRegistry } from '../../utils/navigation-registry';
import { TouchableHighlight } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks/dist';
import { preferencesStore } from '../../stores/preferences-store';
import { nextOnboardingStep } from '../../utils/onboarding';
import Keychain from 'react-native-keychain';

const Host = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const Title = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 20px;
  color: ${props => props.theme.color.dark400};
  margin-bottom: 8px;
  max-width: 75%;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 14px;
  min-height: 20px;
  color: ${props => props.theme.color.dark400};
  max-width: 75%;
  text-align: center;
`;

const Center = styled.View`
  justify-content: center;
  align-items: center;
`;

const MAX_PIN_CHARS = 4;

const Texts = {
  CHOOSE_PIN: 'Veldu 4-tölustafa PIN',
  CONFIRM_PIN: 'Staðfestu PIN númerið',
  NON_MATCHING_PINS: 'Númerin pössuðu ekki saman. Reyndu aftur eða hættu við til að byrja upp á nýtt.',
}

const CancelButton = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.blue400};
`;

const CancelText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.color.blue400};
`;

export const OnboardingPinCodeScreen: NavigationFunctionComponent<{ confirmPin?: string }> = ({ componentId, confirmPin }) => {
  const [code, setCode] = useState('');
  const [invalid, setInvalid] = useState(false);

  const onPinInput = (char: string) => {
    setCode(previousCode => `${previousCode}${previousCode.length >= MAX_PIN_CHARS ? '' : char}`);
  }

  const onBackPress = () => {
    setCode(previousCode => `${previousCode.substr(0, previousCode.length - 1)}`);
  }

  const onCancelPress = () => {
    Navigation.pop(componentId);
  }

  useEffect(() => {
    if (code.length === MAX_PIN_CHARS) {
      if (confirmPin) {
        if (code === confirmPin) {
          Keychain.setGenericPassword('PIN_CODE', code, { service: 'PIN_CODE' }).then(() => {
            preferencesStore.setState(() => ({ hasOnboardedPinCode: true }))
            nextOnboardingStep()
          });
        } else {
          setInvalid(true);
          setTimeout(() => {
            setInvalid(false);
            setCode('');
          }, 660);
        }
      } else {
        setTimeout(() => {
          setCode('');
          Navigation.push(componentId, {
            component: {
              name: ComponentRegistry.OnboardingPinCodeScreen,
              passProps: {
                confirmPin: code,
              }
            }
          });
        }, 110);
      }
    }
  }, [code]);

  return (
    <Host
      testID={testIDs.SCREEN_APP_LOCK}
    >
      <SafeAreaView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
            paddingBottom: 20,
            maxHeight: 200,
            flex: 1,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 45, height: 45, marginBottom: 20 }}
          />
          <Title>{confirmPin ? Texts.CONFIRM_PIN : Texts.CHOOSE_PIN}</Title>
          {/* <Subtitle>{Texts.NON_MATCHING_PINS}</Subtitle> */}
        </View>
        <Center>
          <VisualizedPinCode
            code={code}
            invalid={invalid}
            maxChars={MAX_PIN_CHARS}
          />
          <View style={{ height: 32 }} />
          <PinKeypad
            onInput={onPinInput}
            onBackPress={onBackPress}
            back={code.length > 0}
            faceId={false}
          />
          <View style={{ height: 64, alignItems: 'flex-end', justifyContent: 'center' }}>
            {confirmPin && (
              <CancelButton onPress={onCancelPress}>
                <CancelText>Hætta við</CancelText>
              </CancelButton>
            )}
          </View>
        </Center>
      </SafeAreaView>
    </Host>
  );
}

// export const OnboardingAppLockScreen: NavigationFunctionComponent = ({
//   componentId,
// }) => {
//   const theme = useTheme()
//   const { useBiometrics, setUseBiometrics } = usePreferencesStore()
//   const [hasBiometrics, setHasBiometrics] = useState(false)
//   const [pin, setPin] = useState('')
//   const [confirmPin, setConfirmPin] = useState('')
//   const [pinMatches, setPinMatches] = useState(false)

//   const onBiometricsPress = () => {
//     if (!hasBiometrics) {
//       return
//     }

//     if (useBiometrics) {
//       setUseBiometrics(false)
//       return
//     }

//     // check to see if we want to prompt
//     authenticateAsync().then((authenticate) => {
//       if (authenticate.success) {
//         setUseBiometrics(true)
//       }
//     })
//   }

//   const onContinuePress = () => {
//     preferencesStore.setState(() => ({ hasOnboardedPinCode: true }))
//     return nextOnboardingStep()
//   }

//   useEffect(() => {
//     supportedAuthenticationTypesAsync().then((supportedAuthenticationTypes) => {
//       if (
//         supportedAuthenticationTypes.includes(
//           AuthenticationType.FACIAL_RECOGNITION,
//         )
//       ) {
//         isEnrolledAsync().then((isEnrolled) => {
//           if (isEnrolled) {
//             setHasBiometrics(true)
//           }
//         })
//       }
//     })
//   }, [])

//   useEffect(() => {
//     if (pin === confirmPin && pin.length > 3) {
//       setPinMatches(true)
//       Keyboard.dismiss()
//     } else {
//       setPinMatches(false)
//     }
//   }, [pin, confirmPin])

//   return (
//     <OnBoarding
//       testID={testIDs.SCREEN_ONBOARDING_APP_LOCK}
//       title="Setja upp skjálæsingu"
//       copy="Veldu þér PIN númer á milli 4-16 tölustafi til þess að aflæsa appinu."
//       action={
//         <Button
//           testID={testIDs.ONBOARDING_APP_LOCK_CONTINUE_BUTTON}
//           onPress={onContinuePress}
//           title="Halda áfram"
//           disabled={!pinMatches}
//         />
//       }
//     >
//       <SwitchLabel title="Nota FaceID" onPress={onBiometricsPress}>
//         <Switch
//           trackColor={{ false: theme.color.dark100, true: theme.color.blue400 }}
//           thumbColor={useBiometrics ? '#f4f3f4' : '#f4f3f4'}
//           ios_backgroundColor="#3e3e3e"
//           onValueChange={onBiometricsPress}
//           value={useBiometrics}
//           disabled={!hasBiometrics}
//         />
//       </SwitchLabel>
//       <Input
//         onChangeText={(text) => setPin(text)}
//         placeholder="Leyninúmer"
//         keyboardType="number-pad"
//         secureTextEntry={true}
//         returnKeyType="next"
//         testID={testIDs.ENTER_PIN_NUMBER_INPUT}
//       />
//       <Input
//         onChangeText={(text) => setConfirmPin(text)}
//         placeholder="Staðfesta leyninúmer"
//         keyboardType="number-pad"
//         secureTextEntry={true}
//         testID={testIDs.CONFIRM_PIN_NUMBER_INPUT}
//       />
//     </OnBoarding>
//   )
// }

OnboardingPinCodeScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
}
