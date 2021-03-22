import { ListItem } from '@island.is/island-ui-native'
import React from 'react'
import { ScrollView } from 'react-native'
import { Options } from 'react-native-navigation'

export const Inbox = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <ListItem
        title="Skatturinn"
        description="Greiðsluseðill (Bifr.gjöld TSE12) sem fer svo í tvær línur"
      />
      <ListItem title="Skatturinn" description="Greiðsluseðill" />
      <ListItem title="Fjársýsla ríkisins" description="Greiðsluáskorun" />
      <ListItem title="Skatturinn" description="Álagningaseðill" />
    </ScrollView>
  )
}

Inbox.options = {
  topBar: {
    title: {
      text: 'Rafræn skjöl',
    },
    largeTitle: {
      visible: true,
    },
    searchBar: {
      visible: true,
      hideOnScroll: true,
      hideTopBarOnFocus: true,
      placeholder: 'Leita í rafrænum skjölum',
    },
  },
} as Options
