import { useQuery } from '@apollo/client'
import {
  EmptyList,
  ListItem,
  ListItemSkeleton,
  SearchHeader,
  TopLine,
} from '@island.is/island-ui-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  AppState,
  AppStateStatus,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  View,
} from 'react-native'
import KeyboardManager from 'react-native-keyboard-manager'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import {
  useNavigationSearchBarCancelPress,
  useNavigationSearchBarUpdate,
} from 'react-native-navigation-hooks/dist'
import { useTheme } from 'styled-components/native'
import illustrationSrc from '../../assets/illustrations/le-company-s3.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
import { client } from '../../graphql/client'
import { IDocument } from '../../graphql/fragments/document.fragment'
import {
  ListDocumentsResponse,
  LIST_DOCUMENTS_QUERY,
} from '../../graphql/queries/list-documents.query'
import { useActiveTabItemPress } from '../../hooks/use-active-tab-item-press'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { navigateTo } from '../../lib/deep-linking'
import { lowerCase } from '../../lib/lowercase'
import { inboxStore, useInboxStore } from '../../stores/inbox-store'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { useUiStore } from '../../stores/ui-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'

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
        placeholder: intl.formatMessage({ id: 'inbox.searchPlaceholder' }),
        tintColor: theme.color.blue400,
        backgroundColor: 'transparent',
      },
      rightButtons: initialized ? getRightButtons({ theme } as any) : [],
    },
    bottomTab: {
      iconColor: theme.color.blue400,
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
        hideTopBarOnFocus: true,
      },
      largeTitle: {
        visible: true,
      },
      scrollEdgeAppearance: {
        active: true,
        noBorder: true,
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

const PressableListItem = React.memo(
  ({ item, unread }: { item: IDocument; unread: boolean }) => {
    const { getOrganizationLogoUrl } = useOrganizationsStore()
    return (
      <PressableHighlight
        onPress={() =>
          navigateTo(`/inbox/${item.id}`, { title: item.senderName })
        }
      >
        <ListItem
          title={item.senderName}
          subtitle={item.subject}
          date={new Date(item.date)}
          swipable
          unread={unread}
          onToggleUnread={() => {
            if (unread) {
              inboxStore.getState().actions.setRead(item.id)
            } else {
              inboxStore.getState().actions.setUnread(item.id)
            }
          }}
          icon={
            <Image
              source={getOrganizationLogoUrl(item.senderName, 75)}
              resizeMode="contain"
              style={{ width: 25, height: 25 }}
            />
          }
        />
      </PressableHighlight>
    )
  },
)

export const InboxScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const ui = useUiStore()
  const theme = useTheme()
  const { initialized, readItems, actions } = useInboxStore()
  const intl = useIntl()
  const scrollY = useRef(new Animated.Value(0)).current
  const flatListRef = useRef<FlatList>(null)
  const keyboardRef = useRef(false)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [indexedItems, setIndexedItems] = useState<IndexedDocument[]>([])
  const [inboxItems, setInboxItems] = useState<IDocument[]>([])

  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, { client })

  const isFirstLoad = !res.data
  const isSearch = ui.inboxQuery.length > 0
  const isLoading = res.loading
  const isError = !!res.error
  const isEmpty = (res?.data?.listDocuments ?? []).length === 0

  const isSkeltonView = isLoading && isFirstLoad && !isError
  const isEmptyView = !isLoading && isEmpty

  const emptyItems = [{ id: '0', type: 'empty' }]
  const skeletonItems = Array.from({ length: 11 }).map((_, id) => ({
    id,
    type: 'skeleton',
  }))

  const onAppStateBlur = useCallback((status: AppStateStatus) => {
    if (status !== 'inactive') {
      if (keyboardRef.current) {
        Navigation.mergeOptions(componentId, {
          topBar: {
            searchBar: {
              visible: true,
              focus: true,
              placeholder: intl.formatMessage({
                id: 'inbox.searchPlaceholder',
              }),
            },
          },
        })
      }
    } else {
      KeyboardManager.isKeyboardShowing().then((value) => {
        if (value === true) {
          keyboardRef.current = value
          Navigation.mergeOptions(componentId, {
            topBar: {
              searchBar: {
                visible: false,
                placeholder: intl.formatMessage({
                  id: 'inbox.searchPlaceholder',
                }),
              },
            },
          })
        }
      })
    }
  }, [])

  useActiveTabItemPress(0, () => {
    flatListRef.current?.scrollToOffset({
      offset: -200,
      animated: true,
    })
  })

  useNavigationSearchBarUpdate((e) => {
    if (e.text !== ui.inboxQuery) {
      setSearchLoading(true)
    }
    ui.setInboxQuery(e.text)
  })

  useNavigationSearchBarCancelPress(() => {
    setSearchLoading(true)
    ui.setInboxQuery('')
  })

  // when res data is loaded
  useEffect(() => {
    if (res.data && !res.loading) {
      const items = res?.data?.listDocuments ?? []

      if (!initialized) {
        // mark all as read on first app start
        actions.setInitialized(true)
        actions.setRead(items.map((item) => item.id))
      }

      const indexedItems = items.map((item) => {
        return {
          ...item,
          fulltext: `${lowerCase(item.subject)} ${lowerCase(item.senderName)}`,
        }
      })
      setIndexedItems(indexedItems)
    }
  }, [res.data, res.loading])

  // search query updates
  useEffect(() => {
    setSearchLoading(false)
    const q = lowerCase(ui.inboxQuery.trim())
    if (q !== '') {
      setInboxItems(indexedItems.filter((item) => item.fulltext.includes(q)))
    } else {
      setInboxItems([...indexedItems])
    }
  }, [ui.inboxQuery, indexedItems])

  useEffect(() => {
    if (!initialized) {
      return
    }
    let unreadCount = 0
    indexedItems.forEach((item) => {
      const unread = !readItems.includes(item.id)
      if (unread) {
        unreadCount += 1
      }
    })

    Navigation.mergeOptions(ComponentRegistry.InboxScreen, {
      bottomTab: {
        iconColor: theme.color.blue400,
        textColor: theme.shade.foreground,
        text: initialized
          ? intl.formatMessage({ id: 'inbox.bottomTabText' })
          : '',
        testID: testIDs.TABBAR_TAB_INBOX,
        iconInsets: {
          bottom: -4,
        },
        icon: require('../../assets/icons/tabbar-inbox.png'),
        selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
        badge: unreadCount > 0 ? unreadCount.toString() : (null as any),
        badgeColor: theme.color.red400,
      },
    })
  }, [initialized, readItems, indexedItems])

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppState.addEventListener('change', onAppStateBlur)
      return () => {
        AppState.removeEventListener('change', onAppStateBlur)
      }
    }
  }, [])

  const keyExtractor = useCallback((item: any) => {
    return item.id
  }, [])

  const renderItem = useCallback(
    ({ item }) => {
      if (item.type === 'skeleton') {
        return <ListItemSkeleton />
      }
      if (item.type === 'empty') {
        return (
          <View style={{ marginTop: 80 }}>
            <EmptyList
              title={intl.formatMessage({ id: 'inbox.emptyListTitle' })}
              description={intl.formatMessage({
                id: 'inbox.emptyListDescription',
              })}
              image={
                <Image source={illustrationSrc} height={176} width={134} />
              }
            />
          </View>
        )
      }
      return (
        <PressableListItem item={item} unread={!readItems.includes(item.id)} />
      )
    },
    [readItems],
  )

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        style={{ marginHorizontal: 0, flex: 1 }}
        data={
          isSkeltonView ? skeletonItems : isEmptyView ? emptyItems : inboxItems
        }
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        keyboardDismissMode="on-drag"
        stickyHeaderIndices={isSearch ? [0] : undefined}
        ListHeaderComponent={
          isSearch ? (
            <SearchHeader
              loadingText={intl.formatMessage({ id: 'inbox.loadingText' })}
              resultText={
                inboxItems.length === 0
                  ? intl.formatMessage({ id: 'inbox.noResultText' })
                  : inboxItems.length === 1
                  ? intl.formatMessage({ id: 'inbox.singleResultText' })
                  : intl.formatMessage({ id: 'inbox.resultText' })
              }
              count={inboxItems.length}
              loading={searchLoading}
            />
          ) : undefined
        }
        refreshControl={
          isSearch ? undefined : (
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
          )
        }
      />
      <BottomTabsIndicator index={0} total={3} />
      <TopLine scrollY={scrollY} />
    </>
  )
}

InboxScreen.options = getNavigationOptions
