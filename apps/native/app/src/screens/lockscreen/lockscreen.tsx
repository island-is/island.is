import React from 'react'
import { SafeAreaView,View,Text, Image } from 'react-native'

export const LockScreen = () => {
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
        <Image source={require('../../assets/logo-island.png')} />
        <Text style={{ fontSize: 31, fontWeight: '700', marginTop: 20 }}>Stafrænt Ísland</Text>
      </SafeAreaView>
      <Image source={require('../../assets/illustrations/digital-services-m1.png')} />
    </View>
  )
}
