import { ListItem } from '@island.is/island-ui-native'
import { theme } from '@island.is/island-ui/theme'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
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
import { LIST_DOCUMENTS_QUERY } from '../../graphql/queries/list-documents.query'
import logo from '../../assets/logo/logo-64w.png'

export const InboxScreen: NavigationFunctionComponent = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)

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

  const res = useQuery(LIST_DOCUMENTS_QUERY, { client });
  const inboxItems = res?.data?.listDocuments ?? [];

  const onRefresh = () => {
    setLoading(true)
    Promise.all([
      new Promise(r => setTimeout(r, 1000)),
      res.fetchMore({})
    ])
    .then(() => setLoading(false));
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInset={{ top: 0 }}
      contentInsetAdjustmentBehavior="always"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {inboxItems.map(({ id, title, subtitle }: { id: string, title: string, subtitle: string }) => (
        <ListItem key={id} title={title} subtitle={subtitle} icon={logo} />
      ))}
    </ScrollView>
  )
}
