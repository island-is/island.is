import { useQuery } from '@apollo/client'
import {
  EmptyList, LinkCard, SearchHeader,
  TopLine
} from '@island.is/island-ui-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Animated, AppState, AppStateStatus, FlatList, Image, Platform, TouchableOpacity, View
} from 'react-native'
import KeyboardManager from 'react-native-keyboard-manager'
import {
  Navigation,
  NavigationFunctionComponent
} from 'react-native-navigation'
import {
  useNavigationSearchBarCancelPress,
  useNavigationSearchBarUpdate
} from 'react-native-navigation-hooks/dist'
import illustrationSrc from '../../assets/illustrations/le-company-s3.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { client } from '../../graphql/client'
import { IArticleSearchResults } from '../../graphql/fragments/search.fragment'
import { LIST_SEARCH_QUERY } from '../../graphql/queries/list-search.query'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { openBrowser } from '../../lib/rn-island'
import { useUiStore } from '../../stores/ui-store'
import { testIDs } from '../../utils/test-ids'

interface IndexedApplication extends IArticleSearchResults {
  fulltext: string
}

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'applications.title' }),
      },
      searchBar: {
        placeholder: intl.formatMessage({ id: 'inbox.searchPlaceholder' }),
        tintColor: theme.color.blue400,
      },
      rightButtons: [],
    },
  }),
  {
    topBar: {
      searchBar: {
        visible: true,
        hideTopBarOnFocus: true,
      },
      rightButtons: [],
    },
  },
)

export const ApplicationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)

  const ui = useUiStore()
  const flatListRef = useRef<FlatList>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const keyboardRef = useRef(false)
  const intl = useIntl()

  const res = useQuery(LIST_SEARCH_QUERY, { client })
  const items = res?.data?.searchResults?.items || []
  const [indexedItems, setIndexedItems] = useState<IndexedApplication[]>([])
  const [applicationItems, setApplicationItems] = useState<IArticleSearchResults[]>(
    items || [],
  )
  const scrollY = useRef(new Animated.Value(0)).current

  const renderApplicationItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          openBrowser(`http://island.is/${item.slug}`, componentId)
        }
      >
        <LinkCard>{item.title}</LinkCard>
      </TouchableOpacity>
    ),
    [],
  )

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

  useNavigationSearchBarUpdate((e) => {
    if (e.text !== ui.applicationQuery) {
      setSearchLoading(true)
    }
    ui.setApplicationQuery(e.text)
  })

  useNavigationSearchBarCancelPress(() => {
    setSearchLoading(true)
    ui.setApplicationQuery('')
  })

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppState.addEventListener('change', onAppStateBlur)
      return () => {
        AppState.removeEventListener('change', onAppStateBlur)
      }
    }
  }, [])

  // when res data is loaded
  useEffect(() => {
    if (res.data && !res.loading) {
      const items = res?.data?.searchResults?.items ?? []

      const indexedItems = items.map((item: IArticleSearchResults) => {
        return {
          ...item,
          fulltext: `${item.title.toLocaleLowerCase()}`,
        }
      })

      setIndexedItems(indexedItems)
    }
  }, [res.data, res.loading])

  // search query updates
  useEffect(() => {
    setSearchLoading(false)
    const q = ui.applicationQuery.toLocaleLowerCase().trim()

    if (q !== '') {
      setApplicationItems(
        indexedItems.filter((item: IndexedApplication) => item.fulltext.includes(q)),
      )
    } else {
      setApplicationItems([...indexedItems])
    }
  }, [ui.applicationQuery, indexedItems])

  const keyExtractor = useCallback((item: IArticleSearchResults) => item.id, [])

  const isSearch = ui.applicationQuery.length > 0
  const isLoading = res.loading
  const isEmpty = (res?.data?.searchResults?.items ?? []).length === 0

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (!isLoading && isEmpty) {
    return (
      <View style={{ flex: 1 }}>
        <BottomTabsIndicator index={3} total={4} />
        <EmptyList
          title={intl.formatMessage({ id: 'applications.emptyListTitle' })}
          description={intl.formatMessage({
            id: 'applications.emptyListDescription',
          })}
          image={<Image source={illustrationSrc} height={176} width={134} />}
        />
      </View>
    )
  }

  return (
    <View style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_APPLICATIONS}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        style={{ marginHorizontal: 0, flex: 1 }}
        keyExtractor={keyExtractor}
        keyboardDismissMode="on-drag"
        stickyHeaderIndices={isSearch ? [0] : undefined}
        contentInset={{
          bottom: 32,
        }}
        ListHeaderComponent={
          isSearch ? (
            <SearchHeader
              loadingText={intl.formatMessage({
                id: 'applications.loadingText',
              })}
              resultText={
                applicationItems.length === 0
                  ? intl.formatMessage({ id: 'applications.noResultText' })
                  : applicationItems.length === 1
                  ? intl.formatMessage({ id: 'applications.singleResultText' })
                  : intl.formatMessage({ id: 'applications.resultText' })
              }
              count={applicationItems.length}
              loading={searchLoading}
            />
          ) : undefined
        }
        data={applicationItems}
        renderItem={renderApplicationItem}
      />
      <TopLine scrollY={scrollY} />
    </View>
  )
}

ApplicationsScreen.options = getNavigationOptions
