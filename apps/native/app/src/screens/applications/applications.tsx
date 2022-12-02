import { useQuery } from '@apollo/client'
import {
  EmptyList,
  ListButton,
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
        placeholder: intl.formatMessage({
          id: 'applications.searchPlaceholder',
        }),
        tintColor: theme.color.blue400,
        backgroundColor: 'transparent',
      },
      rightButtons: [],
      background: {
        component:
          Platform.OS === 'android'
            ? {
                name: ComponentRegistry.AndroidSearchBar,
                passProps: {
                  queryKey: 'applicationQuery',
                  placeholder: intl.formatMessage({
                    id: 'applications.searchPlaceholder',
                  }),
                },
              }
            : undefined,
      },
    },
    bottomTab: {
      iconColor: theme.color.blue400,
      text: initialized
        ? intl.formatMessage({ id: 'applications.bottomTabText' })
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
      rightButtons: [],
    },
    bottomTab: {
      testID: testIDs.TABBAR_TAB_APPLICATION,
      iconInsets: {
        bottom: -4,
      },
      icon: require('../../assets/icons/tabbar-application.png'),
      selectedIcon: require('../../assets/icons/tabbar-application-selected.png'),
    },
  },
)

export const ApplicationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const SEARCH_QUERY_SIZE = 100
  const SEARCH_QUERY_TYPE = 'webArticle'
  const CONTENTFUL_FILTER = 'umsokn';
  const QUERY_STRING_DEFAULT = '*'

  const ui = useUiStore()
  const flatListRef = useRef<FlatList>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [queryString, setQueryString] = useState(QUERY_STRING_DEFAULT)
  const keyboardRef = useRef(false)
  const intl = useIntl()
  const [items, setItems] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current

  const input = {
    queryString: queryString,
    types: [SEARCH_QUERY_TYPE],
    contentfulTags: [CONTENTFUL_FILTER],
    size: SEARCH_QUERY_SIZE,
    page: 1,
  }

  const res = useQuery(LIST_SEARCH_QUERY, {
    client,
    variables: {
      input,
    },
  })

  useEffect(() => {
    if (!res.loading && res.data) {
      setItems([...res?.data?.searchResults?.items || []].sort((a: IArticleSearchResults, b: IArticleSearchResults) => a.title.localeCompare(b.title)) as any);
    }
  }, [res.data, res.loading])

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'skeleton') {
      return (
        <ListButton title="skeleton" isLoading />
      )
    }

    if (item.type === 'empty') {
      return (
        <View style={{ marginTop: 80, paddingHorizontal: 16 }}>
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
      <ListButton
        key={item.id}
        title={item.title}
        onPress={() =>
          openBrowser(`http://island.is/${item.slug}`, componentId)
        }
      />
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
                id: 'applications.searchPlaceholder',
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
                  id: 'applications.searchPlaceholder',
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
    const q = ui.applicationQuery.trim()

    if (q !== '') {
      setQueryString(q)
    } else {
      setQueryString(QUERY_STRING_DEFAULT)
    }
  }, [ui.applicationQuery])

  const keyExtractor = useCallback((item: IArticleSearchResults) => item.id, [])

  const isSearch = ui.applicationQuery.length > 0
  const isLoading = res.loading
  const isEmpty = (items ?? []).length === 0
  const isEmptyView = !isLoading && isEmpty && !isSearch

  const emptyItem = [{ id: '0', type: 'empty' }]
  const skeletonItems = Array.from({ length: 8 }).map((_, id) => ({
    id,
    type: 'skeleton',
  }))

  return (
    <>
      <BottomTabsIndicator index={3} total={5} />
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
        style={{ zIndex: 9 }}
        keyExtractor={keyExtractor}
        keyboardDismissMode="on-drag"
        stickyHeaderIndices={[0]}
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
              isAndroid={Platform.OS === 'android'}
            />
          ) : (
            <View />
          )
        }
        data={isLoading ? skeletonItems : isEmptyView ? emptyItem : items}
        renderItem={renderItem}
        refreshing={res?.networkStatus === 4}
        onRefresh={() => res?.refetch()}
      />
      {!isSearch && <TopLine scrollY={scrollY} />}
    </>
  )
}

ApplicationsScreen.options = getNavigationOptions
