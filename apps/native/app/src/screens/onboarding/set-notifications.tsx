import { Button } from '@island.is/island-ui-native';
import React from 'react'
import { ScrollView, Text, Image } from 'react-native';
import { NavigationFunctionComponent } from 'react-native-navigation'
import { OnBoarding } from '../../components/onboarding/onboarding';

export const SetNotificationScreen: NavigationFunctionComponent = () => {

  return (
    // <ScrollView>
      <OnBoarding
        title="Tilkynningar"
        copy="Við getum sent þér app tilkynningar þegar staða umsókna breytist eða nýtt rafrænt skjal er aðgengilegt."
        action={<Button onPress={() => console.log('smellir')} title="Leyfa tilkynningar" />}
      >
        <Image style={{ width: 'auto'}} source={require('../../assets/illustrations/digital-services-m1.png')} />
      </OnBoarding>
    // </ScrollView>
  )
}
