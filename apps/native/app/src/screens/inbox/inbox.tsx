import React, { useCallback, useEffect, useState } from 'react'
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation'
import { RefreshControl, View } from 'react-native'
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
import { FlatList } from 'react-native'
import { IDocument } from '../../graphql/fragments/document.fragment'
import { TouchableHighlight } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SearchBar } from '../../components/search-bar/search-bar'
import { useIntl } from 'react-intl'
import { Image } from 'react-native'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { createNavigationTitle } from '../../utils/create-navigation-title'
import { StyleSheet } from 'react-native'
import { useRef } from 'react'
import { Animated } from 'react-native'

interface IndexedDocument extends IDocument {
  fulltext: string;
}

// Create title options and hook to sync translated title message
const { title, useNavigationTitle } = createNavigationTitle('inbox.screenTitle');

export const InboxScreen: NavigationFunctionComponent = ({ componentId }) => {
  const theme = useTheme()
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const { getOrganizationLogoUrl } = useOrganizationsStore();

  useNavigationTitle(componentId);

  useScreenOptions(
    () => ({
      bottomTab: {
        testID: testIDs.TABBAR_TAB_INBOX,
        selectedIconColor: theme.color.blue400,
        icon: require('../../assets/icons/tabbar-inbox.png'),
        selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
        iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
        text: intl.formatMessage({ id: 'inbox.bottomTabText'}),
      },
    }),
    [theme, intl],
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
            icon={
              <Image
                source={{ uri: getOrganizationLogoUrl(item.senderName, 75) }}
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
              />
            }
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

  const [focus, setFocus] = useState(false);
  const av = useRef(new Animated.Value(0)).current;

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
          onFocus={() => {
            Animated.spring(av, { toValue: 1, useNativeDriver: true }).start();
            setFocus(true);
            Navigation.mergeOptions(componentId, {
              topBar: {
                visible: false,
              }
            });
          }}
          onBlur={() => {
            Animated.spring(av, { toValue: 0, useNativeDriver: true }).start();
            setFocus(false);
            Navigation.mergeOptions(componentId, {
              topBar: {
                visible: true,
              }
            });
          }}
        />
      </SafeAreaView>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              bottom: -200,
              zIndex: 100,
              backgroundColor: 'rgba(0, 0, 0, 0.175)',
              opacity: av
            }
          ]}
          pointerEvents={focus ? 'auto' : 'none'}
        />
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
      </View>
    </>
  )
}

InboxScreen.options = {
  topBar: {
    title
  },
}
