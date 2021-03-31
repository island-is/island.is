import React from 'react'
import { Image, ScrollView, View, Text } from 'react-native'
import { Badge, Button, Heading, StatusCard } from '@island.is/island-ui-native'
import logo from '../../assets/logo/logo-64w.png'
import { useAuthStore } from '../../stores/auth-store'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { testIDs } from '../../utils/test-ids'
import { useTheme } from 'styled-components'
import { useScreenOptions } from '../../contexts/theme-provider'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { NATION_REGISTRY_USER_QUERY } from '../../graphql/queries/national-registry-user.query'
import { useNavigation } from 'react-native-navigation-hooks'



export const HomeScreen: NavigationFunctionComponent = () => {
  const authStore = useAuthStore()
  const theme = useTheme()
  const { setStackRoot } = useNavigation()


  useScreenOptions(
    () => ({
      topBar: {
        title: {
          text: 'Yfirlit',
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_HOME,
        icon: theme.isDark
          ? require('../../assets/icons/tabbar-home-white.png')
          : require('../../assets/icons/tabbar-home.png'),
        selectedIcon: require('../../assets/icons/tabbar-home-selected.png'),
      },
    }),
    [theme],
  )

  const res = useQuery(NATION_REGISTRY_USER_QUERY, { client })

  return (
    <>
      <ScrollView
        testID={testIDs.SCREEN_HOME}
        style={{
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 45, height: 45, marginBottom: 20 }}
          />
        </View>
        <Text
          style={{
            marginTop: 16,
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.shade.foreground,
          }}
        >
          Hæ {authStore.userInfo?.name}
        </Text>
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
      </ScrollView>
      <BottomTabsIndicator index={1} total={3} />
    </>
  )
}
