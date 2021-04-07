import { Button, Input, SwitchLabel } from '@island.is/island-ui-native';
import { theme } from '@island.is/island-ui/theme';
import React, { useEffect, useRef, useState } from 'react'
import { Switch, Keyboard} from 'react-native';
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components';
import { OnBoarding } from '../../components/onboarding/onboarding';
import { useScreenOptions } from '../../contexts/theme-provider';
import { navigateTo } from '../../utils/deep-linking';

export const SetPinScreen: NavigationFunctionComponent = () => {
  const theme = useTheme()
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMatches, setPinMatches] = useState(false);

  useEffect(() => {
    if (pin === confirmPin && pin.length > 3) {
      setPinMatches(true)
      Keyboard.dismiss();
    } else {
      setPinMatches(false);
    }
  }, [pin, confirmPin])

  useScreenOptions(
    () => ({
      popGesture: false,
      topBar: {
        visible: false,
      }
    }), [theme]
  )

  return (
    <OnBoarding
      title="Setja upp skjálæsingu"
      copy="Veldu þér PIN númer á milli 4-16 tölustafi til þess að afælsa appinu."
      action={<Button onPress={() => navigateTo(`/setnotification`)} title="Halda áfram" disabled={!pinMatches} />}
    >
      <SwitchLabel title="Nota FaceID" onPress={toggleSwitch}>
        <Switch
          trackColor={{ false: theme.color.dark100, true: theme.color.blue400 }}
          thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </SwitchLabel>

      <Input onChangeText={text => setPin(text)} placeholder="Leyninúmer" keyboardType="number-pad" secureTextEntry={true} returnKeyType="next" />
      <Input onChangeText={text => setConfirmPin(text)} placeholder="Staðfesta leyninúmer" keyboardType="number-pad" secureTextEntry={true}  />
    </OnBoarding>
  )
}
