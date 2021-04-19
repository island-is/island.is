// import { Heading } from '@island.is/island-ui-native'
import React, { useEffect, useRef } from 'react'
import { Button, SafeAreaView, Text, TouchableNativeFeedbackComponent, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useAuthStore } from '../../stores/auth-store'
import { testIDs } from '../../utils/test-ids'
import { scheduleNotificationAsync } from 'expo-notifications'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useState } from 'react'
import { ScrollView, Switch, Dimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { TableViewGroup } from '../../components/tableview/tableview-group'
import { TableViewCell } from '../../components/tableview/tableview-cell'
import { TouchableHighlight } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'

export const UserScreen: NavigationFunctionComponent = () => {
  const authStore = useAuthStore()
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [tab, setTab] = useState(0);

  const theme = useTheme();
  const { width } = Dimensions.get('window');

  const onTestPushNotificationPress = () => {
    return scheduleNotificationAsync({
      content: {
        title: "Þjóðskrá Íslands",
        body: 'Tilkynning um fasteignamat er tekur gildi 31. desember 2020',
      },
      trigger: { seconds: 5 },
    });
  }

  const onLogoutPress = async () => {
    return;
    await authStore.logout()
    await Navigation.dismissAllModals();
    Navigation.setRoot({
      root: await getAppRoot(),
    })
  };

  const [notificationsNewDocuments, setNotificationsNewDocuments] = useState(false);

  return (
    <View
      style={{
        flex: 1,
      }}
      testID={testIDs.SCREEN_USER}
    >
      <SafeAreaView style={{ marginHorizontal: 16, marginBottom: 32 }}>
        <SegmentedControl
          values={['Virkni', 'Persónuupplýsingar']}
          selectedIndex={tab}
          onChange={(event) => {
            const { selectedSegmentIndex } = event.nativeEvent;
            setTab(selectedSegmentIndex);
          }}
        />
      </SafeAreaView>
      {tab === 0 ? (
      <ScrollView style={{ flex: 1 }}>
        <TableViewGroup header="Tilkynningar og samskipti">
          <TableViewCell
            title="Fá tilkynningar um ný skjöl"
            accessory={<Switch onValueChange={setNotificationsNewDocuments} value={notificationsNewDocuments} />}
          />
          <TableViewCell
            title="Fá tilkynningar um nýjungar í appinu"
            accessory={<Switch onValueChange={() => {}} value={false} />}
          />
          <TableViewCell
            title="Fá tilkynningar um stöðu umsókna"
            accessory={<Switch onValueChange={() => {}} value={false} />}
          />
        </TableViewGroup>
        <TableViewGroup header="Útlit og aðgengi">
          <TableViewCell
            title="Dökkur hamur"
            accessory={<Switch onValueChange={() => {}} value={false} />}
          />
        </TableViewGroup>
        <TableViewGroup header="Annað">
          <TouchableHighlight onPress={onTestPushNotificationPress} underlayColor={theme.color.blue100}>
            <TableViewCell title="Prófa push notification" />
          </TouchableHighlight>
          <TouchableHighlight onPress={onLogoutPress} underlayColor={theme.color.blue100}>
            <TableViewCell title="Útskrá" />
          </TouchableHighlight>
        </TableViewGroup>
      </ScrollView>): (
        <ScrollView style={{ flex: 1 }}>
          <TableViewGroup header="Um þig">
            <TableViewCell title="Kennitala" subtitle={authStore.userInfo?.nationalId} />
            <TableViewCell title="Land" subtitle={authStore.userInfo?.nat} />
            <TableViewCell title="Authorization expires" subtitle={authStore.authorizeResult?.accessTokenExpirationDate} />
          </TableViewGroup>
        </ScrollView>
      )}
    </View>
  )
}

UserScreen.options = {
  topBar: {
    title: {
      text: 'Stillingar',
    }
  }
}
