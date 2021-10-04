import { useQuery } from '@apollo/client'
import {
  EmptyList,
  LinkCard,
  SearchHeader,
  TopLine,
} from '@island.is/island-ui-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Animated,
  AppState,
  AppStateStatus,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
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
import illustrationSrc from '../../assets/illustrations/le-company-s3.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { client } from '../../graphql/client'
import { IArticleSearchResults } from '../../graphql/fragments/search.fragment'
import { LIST_SEARCH_QUERY } from '../../graphql/queries/list-search.query'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { openBrowser } from '../../lib/rn-island'
import { useUiStore } from '../../stores/ui-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { testIDs } from '../../utils/test-ids'

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
        backgroundColor: 'transparent',
      },
      rightButtons: [],
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
      rightButtons: [],
      background: {
        component:
          Platform.OS === 'android'
            ? {
                name: ComponentRegistry.AndroidSearchBar,
                passProps: { queryKey: 'applicationQuery' },
              }
            : undefined,
      },
    },
  },
)

export const ApplicationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const SEARCH_QUERY_SIZE = 40
  const SEARCH_QUERY_TYPE = 'webArticle'
  const TAGS = [{ type: 'processentry', key: 'true' }]
  const QUERY_STRING_DEFAULT = '*'

  const ui = useUiStore()
  const flatListRef = useRef<FlatList>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [queryString, setQueryString] = useState(QUERY_STRING_DEFAULT)
  const keyboardRef = useRef(false)
  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current

  const input = {
    queryString: queryString,
    types: [SEARCH_QUERY_TYPE],
    tags: TAGS,
    size: SEARCH_QUERY_SIZE,
    page: 1,
  }

  const res = useQuery(LIST_SEARCH_QUERY, {
    client,
    variables: {
      input,
    },
  })

  const items = res?.data?.searchResults?.items || ([] as [])

  // refetch load more on scroll
  useEffect(() => {
    if (page > 1) {
      try {
        res
          .fetchMore({
            updateQuery(prev, { fetchMoreResult }) {
              setIsLoadingMore(true)
              const oldIds = prev.searchResults.items.map(
                (item: any) => item.id,
              )
              if (
                !fetchMoreResult ||
                fetchMoreResult.searchResults.items.length === 0
              ) {
                setIsLoadingMore(false)
              }
              return {
                ...prev,
                searchResults: {
                  ...prev.searchResults,
                  items: prev.searchResults.items.concat(
                    fetchMoreResult.searchResults.items.filter(
                      (item: any) => !oldIds.includes(item.id),
                    ),
                  ),
                },
              }
            },
            variables: {
              input: { ...input, page },
            },
          })
          .then(() => setIsLoadingMore(false))
      } catch (err) {
        // noop
      }
    }
  }, [page])



  const renderItem = useCallback(({ item }) => {
    if (item.type === 'loading') {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator size="large" color="#0061FF" />
        </View>
      )
    }

    if (item.type === 'empty') {
      return (
        <View style={{ marginTop: 80 }}>
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
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          openBrowser(`http://island.is/${item.slug}`, componentId)
        }
      >
        <LinkCard>{item.title}</LinkCard>
      </TouchableOpacity>
    )
  }, [])

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

  // search query updates
  useEffect(() => {
    setSearchLoading(false)
    const q = ui.applicationQuery.toLocaleLowerCase().trim()

    if (q !== '') {
      setQueryString(q)
    } else {
      setQueryString(QUERY_STRING_DEFAULT)
    }
  }, [ui.applicationQuery])

  const keyExtractor = useCallback((item: IArticleSearchResults) => item.id, [])

  const isSearch = ui.applicationQuery.length > 0
  const isLoading = res.loading && page === 1
  const isEmpty = (items ?? []).length === 0
  const isEmptyView = !isLoading && isEmpty && !isSearch

  const emptyItem = [{ id: '0', type: 'empty' }]
  const loadingItem = [{ id: '1', type: 'loading' }]

  return (
    <>
      <BottomTabsIndicator index={3} total={3} />
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
        style={{ paddingHorizontal: 16, zIndex: 9 }}
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
                items.length === 0
                  ? intl.formatMessage({ id: 'applications.noResultText' })
                  : items.length === 1
                  ? intl.formatMessage({
                      id: 'applications.singleResultText',
                    })
                  : intl.formatMessage({ id: 'applications.resultText' })
              }
              count={items.length}
              loading={searchLoading}
            />
          ) : undefined
        }
        data={isLoading ? loadingItem : isEmptyView ? emptyItem : items}
        renderItem={renderItem}
        onEndReached={() => !isLoading && setPage((p) => p + 1)}
        onEndReachedThreshold={0.5}
        refreshing={res.networkStatus === 4}
        onRefresh={() => res.refetch()}
        ListFooterComponent={() =>
          !isEmptyView && isSearch && isLoadingMore && (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="large" color="#0061FF" />
            </View>
          )
        }
      />
      <TopLine scrollY={scrollY} />
    </>
  )
}

ApplicationsScreen.options = getNavigationOptions
