import { Container, Heading, Input, ListItem } from '@island.is/island-ui-native';
import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'

export const Inbox = () => {
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <ScrollView>
        <ListItem
          title="Skatturinn"
          description="Greiðsluseðill (Bifr.gjöld TSE12) sem fer svo í tvær línur"
        />
        <ListItem
          title="Skatturinn"
          description="Greiðsluseðill"
        />
        <ListItem
          title="Fjársýsla ríkisins"
          description="Greiðsluáskorun"
        />
        <ListItem
          title="Skatturinn"
          description="Álagningaseðill"
        />

      </ScrollView>
    </SafeAreaView>
  )
}

Inbox.options = {
  topBar: {
    title: {
      text: 'Rafræn skjöl'
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
