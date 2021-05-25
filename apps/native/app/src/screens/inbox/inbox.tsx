import { useQuery } from '@apollo/client'
import { ListItem } from '@island.is/island-ui-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, Platform, RefreshControl, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import {
  useNavigationSearchBarCancelPress,
  useNavigationSearchBarUpdate,
} from 'react-native-navigation-hooks/dist'
import { useTheme } from 'styled-components/native'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
import { client } from '../../graphql/client'
import { IDocument } from '../../graphql/fragments/document.fragment'
import {
  ListDocumentsResponse,
  LIST_DOCUMENTS_QUERY,
} from '../../graphql/queries/list-documents.query'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { useUiStore } from '../../stores/ui-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { navigateTo } from '../../utils/deep-linking'
import { testIDs } from '../../utils/test-ids'
import { useThemedNavigationOptions } from '../../utils/use-themed-navigation-options'

interface IndexedDocument extends IDocument {
  fulltext: string
}

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'inbox.screenTitle' }),
      },
      searchBar: {
        tintColor: theme.color.blue400,
      },
    },
    bottomTab: {
      text: initialized
        ? intl.formatMessage({ id: 'inbox.bottomTabText' })
        : '',
    },
  }),
  {
    topBar: {
      elevation: 0,
      height: 120,
      searchBar: {
        visible: true,
        placeholder: 'Leita að skjölum...',
        hideTopBarOnFocus: true,
      },
      background: {
        component:
          Platform.OS === 'android'
            ? {
                name: ComponentRegistry.AndroidSearchBar,
              }
            : undefined,
      },
    },
    bottomTab: {
      testID: testIDs.TABBAR_TAB_INBOX,
      iconInsets: {
        bottom: -4,
      },
      icon: require('../../assets/icons/tabbar-inbox.png'),
      selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
    },
  },
)

const PressableListItem = ({ item }: { item: IDocument }) => {
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  return (
    <PressableHighlight
      onPress={() => navigateTo(`/inbox/${item.id}`)}
    >
      <ListItem
        title={item.senderName}
        subtitle={item.subject}
        date={new Date(item.date)}
        swipable
        icon={
          <Image
            source={{ uri: getOrganizationLogoUrl(item.senderName, 75) }}
            resizeMode="contain"
            style={{ width: 25, height: 25 }}
          />
        }
      />
    </PressableHighlight>
  );
}

export const InboxScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const theme = useTheme()
  const ui = useUiStore()
  const [loading, setLoading] = useState(false)
  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, { client })
  const [indexedItems, setIndexedItems] = useState<IndexedDocument[]>([])
  const [inboxItems, setInboxItems] = useState<IDocument[]>([])

  const renderInboxItem = useCallback(
    ({ item }: { item: IDocument }) => <PressableListItem item={item} />,
    [theme],
  )

  const [query, setQuery] = useState('')

  useNavigationSearchBarUpdate((e) => {
    setQuery(e.text)
  })

  useNavigationSearchBarCancelPress(() => {
    setQuery('')
  })

  useEffect(() => {
    const items = res?.data?.listDocuments ?? []
    const indexedItems = items.map((item) => ({
      ...item,
      fulltext: `${item.subject.toLocaleLowerCase()} ${item.senderName.toLocaleLowerCase()}`,
    }))
    setIndexedItems(indexedItems)
    setInboxItems(indexedItems)
  }, [res.data])

  useEffect(() => {
    const q = query.toLocaleLowerCase().trim()
    if (q !== '') {
      setInboxItems(indexedItems.filter((item) => item.fulltext.includes(q)))
    } else {
      setInboxItems(indexedItems)
    }
  }, [ui.query])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ marginHorizontal: 0, flex: 1 }}
        data={inboxItems}
        keyExtractor={(item: any) => item.id}
        renderItem={renderInboxItem}
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true)
              try {
                res
                  ?.refetch?.()
                  ?.then(() => {
                    setLoading(false)
                  })
                  .catch((err) => {
                    setLoading(false)
                  })
              } catch (err) {
                // noop
                setLoading(false)
              }
            }}
          />
        }
      />
      <BottomTabsIndicator index={0} total={3} />
    </View>
  )
}

InboxScreen.options = getNavigationOptions
