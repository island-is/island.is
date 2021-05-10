import React, { useCallback, useEffect, useState } from 'react'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { RefreshControl } from 'react-native'
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
import { useTranslatedTitle } from '../../utils/use-translated-title'
import { FlatList } from 'react-native'
import { IDocument } from '../../graphql/fragments/document.fragment'
import { TouchableHighlight } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SearchBar } from '../../components/search-bar/search-bar'

interface IndexedDocument extends IDocument {
  fulltext: string;
}

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
  const [indexedItems, setIndexedItems] = useState<IndexedDocument[]>([]);
  const [inboxItems, setInboxItems] = useState<IDocument[]>([]);

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

  const [query, setQuery] = useState('');

  const onSearch = () => {
    const q = query.toLocaleLowerCase().trim()
    if (q !== '') {
      setInboxItems(indexedItems.filter(item => item.fulltext.includes(q)));
    } else {
      setInboxItems(indexedItems);
    }
  }

  useEffect(() => {
    const items = res?.data?.listDocuments ?? [];
    const indexedItems = items.map(item => ({
      ...item,
      fulltext: `${item.subject.toLocaleLowerCase()} ${item.senderName.toLocaleLowerCase()}`
    }));
    setIndexedItems(indexedItems);
    setInboxItems(indexedItems);
  }, [res.data]);

  // useEffect(() => {
  //   const q = query.toLocaleLowerCase().trim()
  //   if (q !== '') {
  //     setInboxItems(indexedItems.filter(item => item.fulltext.includes(q)));
  //   } else {
  //     setInboxItems(indexedItems);
  //   }
  // }, [indexedItems, query])

  return (
    <>
      <SafeAreaView style={{ marginHorizontal: 16, marginVertical: 8 }}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Finndu skjal"
          onSearchPress={onSearch}
          returnKeyType="search"
          onSubmitEditing={onSearch}
          onCancelPress={() => {
            setQuery('');
            setInboxItems(indexedItems);
          }}
        />
      </SafeAreaView>
      <FlatList
        style={{ marginHorizontal: 0, flex: 1 }}
        data={inboxItems}
        keyExtractor={(item: any) => item.id}
        renderItem={renderInboxItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => {
            setLoading(true);
            try {
              res?.refetch?.()?.then(() => {
                setLoading(false);
              }).catch(err => {
                setLoading(false);
              })
            } catch (err) {
              // noop
              setLoading(false);
            }
          }} />
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
