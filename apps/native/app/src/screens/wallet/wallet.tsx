import { Card, CardColor, ListItem } from '@island.is/island-ui-native';
import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'

export const Wallet = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView horizontal={false}>
        <ScrollView horizontal style={{ marginTop: 50 }}>
          <Card title="Ökuskírteini" />
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

Wallet.options = {
  topBar: {
    title: {
      text: 'Skírteinin þín'
    },
    largeTitle: {
      visible: true
    },
    searchBar: {
      visible: true,
      hideOnScroll: true,
    }
  }
};
