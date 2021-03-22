import { Heading, Card, Input, ListItem, Container } from '@island.is/island-ui-native';
import React from 'react'
import { SafeAreaView, ScrollView, Text } from 'react-native'

export const Wallet = () => {
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <ScrollView>
        <ScrollView horizontal style={{ marginTop: 50, marginBottom: 50 }}>
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
