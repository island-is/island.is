import { useQuery } from '@apollo/client'
import { ListItem } from '@island.is/island-ui-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, Image, Platform, RefreshControl, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import {
  useNavigationSearchBarCancelPress,
  useNavigationSearchBarUpdate,
} from 'react-native-navigation-hooks/dist'
import { useTheme } from 'styled-components'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
import { useScreenOptions } from '../../contexts/theme-provider'
import { client } from '../../graphql/client'
import { IDocument } from '../../graphql/fragments/document.fragment'
import {
  ListDocumentsResponse,
  LIST_DOCUMENTS_QUERY,
} from '../../graphql/queries/list-documents.query'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { uiStore } from '../../stores/ui-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { createNavigationTitle } from '../../utils/create-navigation-title'
import { navigateTo } from '../../utils/deep-linking'
import { testIDs } from '../../utils/test-ids'
import { theme } from '../../utils/theme'

interface IndexedDocument extends IDocument {
  fulltext: string
}

// Create title options and hook to sync translated title message
const { title, useNavigationTitle } = createNavigationTitle('inbox.screenTitle')

export const InboxScreen: NavigationFunctionComponent = ({ componentId }) => {
  const theme = useTheme()
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const { getOrganizationLogoUrl } = useOrganizationsStore()

  useNavigationTitle(componentId)
  useScreenOptions(
    () => ({
      bottomTab: {
        testID: testIDs.TABBAR_TAB_INBOX,
        selectedIconColor: theme.color.blue400,
        iconInsets: {
          bottom: -4,
        },
        icon: require('../../assets/icons/tabbar-inbox.png'),
        selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
        iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
        text: intl.formatMessage({ id: 'inbox.bottomTabText' }),
        textColor: theme.shade.foreground,
        selectedTextColor: theme.shade.foreground,
      },
      topBar: {
        elevation: 0,
        height: 120,
        background: {
          component:
            Platform.OS === 'android'
              ? {
                  name: ComponentRegistry.AndroidSearchBar,
                }
              : undefined,
        },
        searchBar: {
          // tintColor: theme.color.blue400,
          backgroundColor: '#fff',
          visible: true,
          placeholder: 'Leita að skjölum...',
        },
      },
    }),
    [theme, intl],
  )

  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, { client })
  const [indexedItems, setIndexedItems] = useState<IndexedDocument[]>([])
  const [inboxItems, setInboxItems] = useState<IDocument[]>([])

  const renderInboxItem = useCallback(
    ({ item }: { item: IDocument }) => {
      return (
        <PressableHighlight
          // highlightColor={theme.isDark ? '#080817' : theme.color.blue100}
          onPress={() => navigateTo(`/inbox/${item.id}`)}
        >
          <ListItem
            title={item.senderName}
            subtitle={item.subject}
            date={new Date(item.date)}
            icon={
              <Image
                source={{ uri: getOrganizationLogoUrl(item.senderName, 75) }}
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
              />
            }
          />
        </PressableHighlight>
      )
    },
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
  }, [query])

  useEffect(() => {
    uiStore.subscribe(
      (q: string) => {
        setQuery(q)
      },
      (store) => store.query,
    )
  }, [])

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

InboxScreen.options = {
  topBar: {
    title,
    elevation: 0,
    height: 120,
    background: {
      component:
        Platform.OS === 'android'
          ? {
              name: ComponentRegistry.AndroidSearchBar,
            }
          : undefined,
    },
    searchBar: {
      tintColor: theme.color.blue400,
      visible: true,
      placeholder: 'Leita að skjölum...',
    },
  },
}
