import { Card, CardColor, ListItem } from '@island.is/island-ui-native';
import React from 'react'
import { Linking, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation';
import { config } from '../../utils/config';
import { ComponentRegistry } from '../../utils/navigation-registry';

export const WalletScreen: NavigationFunctionComponent = () => {
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
          style={{ marginTop: 50, marginBottom: 50 }}
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
    searchBar: {
      visible: true,
      hideOnScroll: true,
      hideTopBarOnFocus: true,
    }
  }
};
