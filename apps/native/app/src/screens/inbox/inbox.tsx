import React, { useCallback, useState } from 'react'
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation'
import { RefreshControl, ScrollView } from 'react-native'
import { ListItem } from '@island.is/island-ui-native'
import { navigateTo } from '../../utils/deep-linking'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { Logo } from '../../components/logo/logo'
import { useTheme } from 'styled-components'
import { useScreenOptions } from '../../contexts/theme-provider'
import { testIDs } from '../../utils/test-ids'
import {
  ListDocumentsResponse,
  LIST_DOCUMENTS_QUERY,
} from '../../graphql/queries/list-documents.query'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { ComponentRegistry } from '../../utils/navigation-registry'
import { useIntl } from '../../utils/intl'
import { useTranslatedTitle } from '../../utils/use-translated-title'
import { FlatList } from 'react-native'
import { IDocument } from '../../graphql/fragments/document.fragment'
import { TouchableHighlight } from 'react-native'

export const InboxScreen: NavigationFunctionComponent = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)

  useTranslatedTitle('INBOX_NAV_TITLE', 'inbox.screenTitle');
  useScreenOptions(
    () => ({
      bottomTab: {
        testID: testIDs.TABBAR_TAB_INBOX,
        selectedIconColor: theme.color.blue400,
        icon: require('../../assets/icons/tabbar-inbox.png'),
        selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
        iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
      },
    }),
    [theme],
  );

  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, { client })
  const inboxItems = res?.data?.listDocuments ?? []

  const onRefresh = useCallback(() => {
    setLoading(true)
    Promise.all([
      new Promise((r) => setTimeout(r, 1000)),
    ]).then(() => setLoading(false))
  }, [res]);

  const renderInboxItem = useCallback(({ item }: { item: IDocument }) => {
    return (
      <TouchableHighlight
        underlayColor={theme.color.blue100}
        onPress={() => navigateTo(`/inbox/${item.id}`)}
      >
        <ListItem
            title={item.senderName}
            subtitle={item.subject}
            date={new Date()}
            icon={<Logo name={item.senderName} />}
        />
      </TouchableHighlight>
    );
  }, []);

  return (
    <>
      <FlatList
        style={{ marginHorizontal: 0, flex: 1 }}
        data={inboxItems}
        keyExtractor={(item: any) => item.id}
        renderItem={renderInboxItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
      <BottomTabsIndicator index={0} total={3} />
    </>
  )
}

InboxScreen.options = {
  topBar: {
    title: {
      component: {
        id: 'INBOX_NAV_TITLE',
        name: ComponentRegistry.NavigationBarTitle,
        passProps: {
          title: 'Inbox',
        }
      },
      alignment: 'fill'
    },
  },
}
