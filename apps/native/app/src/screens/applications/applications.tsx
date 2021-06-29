import { useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { LinkCard, Heading } from '@island.is/island-ui-native'
import { Text, View, Linking, FlatList, TouchableOpacity } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { LIST_SEARCH_QUERY } from '../../graphql/queries/list-search.query'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { getRightButtons } from '../../utils/get-main-root'
import { client } from '../../graphql/client'
import { testIDs } from '../../utils/test-ids'
import { IArticleSearchResults } from '../../graphql/fragments/search.fragment'
import { navigateTo } from '../../lib/deep-linking'
import { openBrowser } from '../../lib/rn-island'

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'applications.title' }),
      },
      rightButtons: initialized ? getRightButtons({ theme } as any) : [],
    },
    bottomTab: {
      iconColor: theme.color.blue400,
      text: initialized
        ? intl.formatMessage({ id: 'applications.bottomTabText' })
        : '',
    },
  }),
  {
    topBar: {},
    bottomTab: {
      testID: testIDs.SCREEN_APPLICATIONS,
      iconInsets: {
        bottom: -4,
      },
      icon: require('../../assets/icons/tabbar-applications.png'),
      selectedIcon: require('../../assets/icons/tabbar-applications.png'),
    },
  },
)

export const ApplicationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)

  const res = useQuery(LIST_SEARCH_QUERY, { client })
  const items = res?.data?.searchResults?.items || []

  const renderApplicationItem = useCallback(
    ({ item }) => (
      <TouchableOpacity key={item.id} onPress={() => openBrowser(`http://island.is/${item.slug}`, componentId)}>
        <LinkCard>
          {item.title}
        </LinkCard>
      </TouchableOpacity>
    ),
    [],
  )

  const keyExtractor = useCallback((item: IArticleSearchResults) => item.id, [])
  console.log(items, 'items')
  return (
    <View style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}>
      <Heading>Umsóknir á Ísland.is</Heading>

      <FlatList
        testID={testIDs.SCREEN_APPLICATIONS}
        keyExtractor={keyExtractor}
        contentInset={{
          bottom: 32,
        }}
        data={items}
        renderItem={renderApplicationItem}
      />
    </View>
  )
}

ApplicationsScreen.options = getNavigationOptions
