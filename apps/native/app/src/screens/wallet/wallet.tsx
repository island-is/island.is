import { Card, CardColor, ListItem } from '@island.is/island-ui-native';
import React from 'react'
import { Linking, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation';
import { useTheme } from 'styled-components';
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator';
import { useScreenOptions } from '../../contexts/theme-provider';
import { config } from '../../utils/config';
import { navigateTo } from '../../utils/deep-linking';
import { ComponentRegistry } from '../../utils/navigation-registry';
import { testIDs } from '../../utils/test-ids';

export const WalletScreen: NavigationFunctionComponent = () => {
  const theme = useTheme();
  useScreenOptions(() => ({
    topBar: {
      title: {
        text: 'Skírteinin þín',
      }
    },
    bottomTab: {
      testID: testIDs.TABBAR_TAB_WALLET,
      selectedIconColor: theme.color.blue400,
      icon: require('../../assets/icons/tabbar-wallet.png'),
      selectedIcon: require('../../assets/icons/tabbar-wallet-selected.png'),
      iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
    }
  }), [theme]);

  return (
    <>
      <ScrollView horizontal={false}>
        <ScrollView
          horizontal
          snapToInterval={260+30}
          showsHorizontalScrollIndicator={false}
          snapToAlignment={"start"}
          contentInset={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 30,
          }}
          contentInsetAdjustmentBehavior="automatic"
          decelerationRate={0}
          style={{ marginTop: 50, marginBottom: 50 }}
        >
          <TouchableOpacity onPress={() => navigateTo('/wallet/drivers-license')}>
            <Card title="Ökuskírteini" />
          </TouchableOpacity>
          <Card title="Skotvopnaleyfi" color={CardColor.YELLOW} />
          <Card title="Fyrsta hjálp" />
          <Card title="Siglinga réttindi" color={CardColor.YELLOW} />
        </ScrollView>
        {/* <Container>
          <Input placeholder="Finndu skírteini" />
        </Container> */}

        <ListItem
          title="Ríkislögreglustjóri"
          description="Ökuskírteini"
        />
        <ListItem
          title="Ríkislögreglustjóri"
          description="Skotvopnaleyfi"
        />
        <ListItem
          title="Rauði Krossinn"
          description="Fyrsta hjálp"
        />
        <ListItem
          title="Ríkislögreglustjóri"
          description="Siglingaréttindi"
        />
      </ScrollView>
      <BottomTabsIndicator index={2} total={3} />
    </>
  )
}
