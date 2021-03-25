import React, { useState } from 'react'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { RefreshControl, ScrollView } from 'react-native'
import { ListItem } from '@island.is/island-ui-native'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { config } from '../../utils/config';
import { Logo } from '../../components/logo/logo'
import { useTheme } from 'styled-components'
import { useScreenOptions } from '../../contexts/theme-provider'
import { testIDs } from '../../utils/test-ids'
import { ListDocumentsResponse, LIST_DOCUMENTS_QUERY } from '../../graphql/queries/list-documents.query'

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

  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, { client });
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
      {inboxItems.map(({ id, subject, senderName }) => (
        <ListItem
          key={id}
          title={senderName}
          subtitle={subject}
          icon={<Logo name={senderName} />}
          link={`${config.bundleId}://inbox/${id}`}
        />
      ))}
    </ScrollView>
  )
}
