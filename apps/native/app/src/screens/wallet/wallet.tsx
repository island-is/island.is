import { Card, CardColor, ListItem } from '@island.is/island-ui-native';
import React from 'react'
import { Linking, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { NavigationFunctionComponent } from 'react-native-navigation';
import { config } from '../../utils/config';
import { ComponentRegistry } from '../../utils/navigation-registry';
import { LIST_LICENSES_QUERY } from '../../graphql/queries/list-licenses.query';
import logo from '../../assets/logo/logo-64w.png'

export const WalletScreen: NavigationFunctionComponent = () => {
  const res = useQuery(LIST_LICENSES_QUERY, { client });
  const licenseItems = res?.data?.listLicenses ?? [];

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <TouchableOpacity onPress={() => {
            Linking.openURL(`${config.bundleId}://wallet/drivers-license`);
          }}><Card title="Ökuskírteini" /></TouchableOpacity>
          <Card title="Skotvopnaleyfi" color={CardColor.YELLOW} />
          <Card title="Fyrsta hjálp" />
          <Card title="Siglinga réttindi" color={CardColor.YELLOW} />
        </ScrollView>
        {/* <Container>
          <Input placeholder="Finndu skírteini" />
        </Container> */}

        {licenseItems.map(({ id, title, subtitle }: { id: string, title: string, subtitle: string }) => (
          <ListItem key={id} title={title} subtitle={subtitle} icon={logo} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

WalletScreen.options = {
  topBar: {
    title: {
      text: 'Skírteinin þín',
      component: {
        name: ComponentRegistry.NavigationBarTitle,
        alignment: 'fill',
        passProps: {
          title: 'Skírteinin þín',
        },
      },
    },
    // largeTitle: {
    //   visible: true
    // },
    // searchBar: {
    //   visible: true,
    //   hideOnScroll: true,
    //   hideTopBarOnFocus: true,
    // }
  }
};
