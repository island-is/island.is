import { ListItem } from '@island.is/island-ui-native'
import { theme } from '@island.is/island-ui/theme'
import React, { useEffect, useState } from 'react'
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import { NavigationFunctionComponent, Options, Navigation } from 'react-native-navigation'
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks'
import { ComponentRegistry } from '../../utils/navigation-registry'

export const InboxScreen: NavigationFunctionComponent = () => {
  // const [idle, setIdle] = useState(true)
  const [loading, setLoading] = useState(false)
  const onRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  // useNavigationComponentDidAppear(() => {
  //   setIdle(false)
  // });

  // if (idle) {
  //   return null
  // }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInset={{ top: 0 }}
      contentInsetAdjustmentBehavior="always"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <ListItem
        title="Skatturinn"
        description="Greiðsluseðill (Bifr.gjöld TSE12) sem fer svo í tvær línur"
      />
      <ListItem title="Skatturinn" description="Greiðsluseðill" />
      <ListItem title="Fjársýsla ríkisins" description="Greiðsluáskorun" />
      <ListItem title="Skatturinn" description="Álagningaseðill" />
      <ListItem title="Skatturinn" description="Greiðsluseðill" />
      <ListItem title="Fjársýsla ríkisins" description="Greiðsluáskorun" />
      <ListItem title="Skatturinn" description="Álagningaseðill" />
      <ListItem title="Skatturinn" description="Greiðsluseðill" />
      <ListItem title="Fjársýsla ríkisins" description="Greiðsluáskorun" />
      <ListItem title="Skatturinn" description="Álagningaseðill" />
      <ListItem title="Skatturinn" description="Greiðsluseðill" />
      <ListItem title="Fjársýsla ríkisins" description="Greiðsluáskorun" />
      <ListItem title="Skatturinn" description="Álagningaseðill" />
    </ScrollView>
  )
}

InboxScreen.options = {
  topBar: {
    title: {
      // text: 'Rafræn skjöl',
      // color: theme.color.blue600,
      // fontSize: 19,
      // fontWeight: '600',
      component: {
        name: ComponentRegistry.NavigationBarTitle,
        alignment: 'fill',
        passProps: {
          title: 'Rafræn skjöl',
        },
      },
    },
    // largeTitle: {
    //   visible: true,
    //   color: theme.color.blue600,
    //   fontSize: 24,
    //   fontWeight: '700',
    // },
    // searchBar: {
    //   visible: true,
    //   hideOnScroll: true,
    //   hideTopBarOnFocus: true,
    //   placeholder: 'Leita í rafrænum skjölum',
    //   // obscuresBackgroundDuringPresentation: true
    // },
  },
} as Options
