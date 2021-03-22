import React from 'react'
import { SafeAreaView, StatusBar, Image, ScrollView, View, Text } from 'react-native'
import { Badge, Button, Container, Heading, StatusCard } from '@island.is/island-ui-native'
import logo from '../../assets/logo-island.png';
import { useAuthStore } from '../../auth/auth';
import {  useNavigation } from 'react-native-navigation-hooks'
import { theme } from '@island.is/island-ui/theme';

export const Home = () => {
  const { push } = useNavigation()
  const authStore = useAuthStore();
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <ScrollView>
        <View
          style={{
            height: '100%',
            marginTop: 10,
            backgroundColor: `${theme.color.blue100}`
          }}
        >
          <Container>
            <View style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 50,
            }}>
              <Image source={logo} resizeMode="contain" style={{ width: 45, height: 45, marginBottom: 20 }} />
            </View>
            <Text style={{ marginTop: 16, textAlign: 'center', fontWeight: 'bold' }}>Hæ {authStore.userInfo?.name}</Text>
            <Heading isCenterAligned>Staða umsókna</Heading>
            <StatusCard
              title="Fæðingarorlof 4/6"
              description="Skipting orlofstíma"
              badge={<Badge title="Vantar gögn" />}
              progress={66}
            />
            <StatusCard
              title="Fæðingarorlof 1/3"
              description="Skipting orlofstíma"
              badge={<Badge title="Vantar gögn" />}
              progress={33}
              />
            <StatusCard
              title="Fæðingarorlof 9/10"
              description="Skipting orlofstíma"
              badge={<Badge title="Vantar gögn" />}
              progress={90}
            />
            <StatusCard
              title="Fæðingarorlof 4/6"
              description="Skipting orlofstíma"
              badge={<Badge title="Vantar gögn" />}
              progress={66}
            />
            <StatusCard
              title="Fæðingarorlof 1/3"
              description="Skipting orlofstíma"
              badge={<Badge title="Vantar gögn" />}
              progress={33}
              />
            <StatusCard
              title="Fæðingarorlof 9/10"
              description="Skipting orlofstíma"
              badge={<Badge title="Vantar gögn" />}
              progress={90}
            />
          </Container>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

Home.options = {
  topBar: {
    title: {
      text: 'Heim'
    }
  }
};
