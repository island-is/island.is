import { ListItem } from '@island.is/island-ui-native'
import { theme } from '@island.is/island-ui/theme'
import React, { useEffect, useState } from 'react'
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import {
  NavigationFunctionComponent,
  Options,
  Navigation,
} from 'react-native-navigation'
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks'
import { useTheme } from 'styled-components'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useScreenOptions } from '../../contexts/theme-provider'
import { ComponentRegistry } from '../../utils/navigation-registry'
import { testIDs } from '../../utils/test-ids'

export const InboxScreen: NavigationFunctionComponent = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const onRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  useScreenOptions(
    () => ({
      topBar: {
        title: {
          text: 'Rafræn skjöl',
        },
        searchBar: {
          visible: true,
          hideOnScroll: true,
          hideTopBarOnFocus: true,
          placeholder: 'Leita í rafrænum skjölum',
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_INBOX,
        selectedIconColor: theme.color.blue400,
        icon: require('../../assets/icons/tabbar-inbox.png'),
        selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
        iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
      },
    }),
    [theme],
  )

  return (
    <>
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
      <BottomTabsIndicator index={0} total={3} />
    </>
  )
}
