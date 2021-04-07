import { Button } from '@island.is/island-ui-native';
import React from 'react'
import { ScrollView, Text, Image } from 'react-native';
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components';
import { OnBoarding } from '../../components/onboarding/onboarding';
import { useScreenOptions } from '../../contexts/theme-provider';
import { navigateTo } from '../../utils/deep-linking';

export const SetNotificationScreen: NavigationFunctionComponent = () => {
  const theme = useTheme()
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
      title="Tilkynningar"
      copy="Við getum sent þér app tilkynningar þegar staða umsókna breytist eða nýtt rafrænt skjal er aðgengilegt."
      action={<Button onPress={() => navigateTo('/')} title="Leyfa tilkynningar" />}
    >
      <Image style={{ width: 'auto'}} source={require('../../assets/illustrations/digital-services-m1.png')} />
    </OnBoarding>
  )
}
