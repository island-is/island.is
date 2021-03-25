import { Card, CardColor, ListItem } from '@island.is/island-ui-native';
import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { NavigationFunctionComponent } from 'react-native-navigation';
import { useTheme } from 'styled-components';
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator';
import { useScreenOptions } from '../../contexts/theme-provider';
import { navigateTo } from '../../utils/deep-linking';
import { testIDs } from '../../utils/test-ids';
import { LIST_LICENSES_QUERY } from '../../graphql/queries/list-licenses.query';
import { Logo } from '../../components/logo/logo';

export const WalletScreen: NavigationFunctionComponent = () => {
  const theme = useTheme();
  const res = useQuery(LIST_LICENSES_QUERY, { client });
  const licenseItems = res?.data?.listLicenses ?? [];

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
          style={{ marginTop: 50, marginBottom: 10 }}
        >
          <TouchableOpacity onPress={() => navigateTo('/wallet/drivers-license')}>
            <Card title="Ökuskírteini" />
          </TouchableOpacity>
          <Card title="Skotvopnaleyfi" color={CardColor.YELLOW} />
          <Card title="Vegabréf" />
          <Card title="Sakavottorð" color={CardColor.YELLOW} />
        </ScrollView>
        {/* <Container>
          <Input placeholder="Finndu skírteini" />
        </Container> */}

        {licenseItems.map(({ id, title, subtitle }: { id: string, title: string, subtitle: string }) => (
          <ListItem key={id} title={title} subtitle={subtitle} icon={<Logo name={title} />} onPress={() => navigateTo(`/wallet/${id}`)} />
        ))}
      </ScrollView>
      <BottomTabsIndicator index={2} total={3} />
    </>
  )
}
