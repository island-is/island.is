import { Card, Input, ListItem, Container } from '@island.is/island-ui-native';
import React from 'react'
import { SafeAreaView, ScrollView, } from 'react-native'

export const Wallet = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView horizontal={false}>
        <ScrollView
          horizontal
          snapToInterval={260+30}
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
          <Card title="Ökuskírteini" />
          <Card title="Skotvopnaleyfi" />
          <Card title="Fyrsta hjálp" />
          <Card title="Siglinga réttindi" />
        </ScrollView>
        <Container>
          <Input placeholder="Finndu skírteini" />
        </Container>
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
