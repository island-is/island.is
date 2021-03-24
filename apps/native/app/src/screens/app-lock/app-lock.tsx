import React from 'react'
import { SafeAreaView,View,Text, Image } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import logo from '../../assets/logo/logo-64w.png'

export const AppLockScreen: NavigationFunctionComponent = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f7ff'
      }}
    >
      <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Image source={logo} />
        <Text style={{ fontSize: 32, marginTop: 20, fontFamily: 'IBMPlexSans-Bold' }}>Stafrænt Ísland</Text>
      </SafeAreaView>
      <Image source={require('../../assets/illustrations/digital-services-m1.png')} />
    </View>
  )
}
