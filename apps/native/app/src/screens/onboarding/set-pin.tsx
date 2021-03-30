import { Button, Heading, Input, SwitchLabel } from '@island.is/island-ui-native';
import { theme } from '@island.is/island-ui/theme';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { ScrollView, Text, Switch, View } from 'react-native';
import { NavigationFunctionComponent } from 'react-native-navigation'
import { OnBoarding } from '../../components/onboarding/onboarding';

export const SetPinScreen: NavigationFunctionComponent = () => {

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMatches, setPinMatches] = useState(false);

  useEffect(() => {
    console.log(pin, confirmPin, 'pins here', pin.length)

    if (pin === confirmPin && pin.length > 3) {
      setPinMatches(true)
    } else {
      setPinMatches(false);
    }
  }, [pin, confirmPin])

  return (
    <OnBoarding
      title="Setja upp skjálæsingu"
      copy="Veldu þér PIN númer á milli 4-16 tölustafi til þess að afælsa appinu."
      action={<Button onPress={() => console.log('smellir')} title="Áfram" />}
    >
      <SwitchLabel title="Nota FaceID">
        <Switch
          trackColor={{ false: theme.color.dark100, true: theme.color.blue400 }}
          thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </SwitchLabel>

      <Input onChangeText={text => setPin(text)} placeholder="Leyninúmer" keyboardType="number-pad" secureTextEntry={true} />
      <Input onChangeText={text => setConfirmPin(text)} placeholder="Staðfesta leyninúmer" keyboardType="number-pad" secureTextEntry={true}  />
      {pinMatches && <Text>PIN númer passar</Text>}

    </OnBoarding>
  )
}
