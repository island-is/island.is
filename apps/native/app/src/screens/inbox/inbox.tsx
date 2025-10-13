import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsTopBar,
} from 'react-native-navigation'
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
} from 'react-native-navigation-hooks'
import styled, { useTheme } from 'styled-components/native'

import { useApolloClient } from '@apollo/client'
import filterIcon from '../../assets/icons/filter-icon.png'
import inboxReadIcon from '../../assets/icons/inbox-read.png'
import illustrationSrc from '../../assets/illustrations/le-company-s3.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  DocumentV2,
  useListDocumentsQuery,
  useMarkAllDocumentsAsReadMutation,
  usePostMailActionMutationMutation,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useThrottleState } from '../../hooks/use-throttle-state'
import { navigateTo } from '../../lib/deep-linking'
import { useUiStore } from '../../stores/ui-store'
import {
  Button,
  EmptyList,
  ListItem,
  ListItemSkeleton,
  SearchBar,
  Tag,
  TopLine,
} from '../../ui'
import { ButtonRegistry } from '../../utils/component-registry'
import { isAndroid } from '../../utils/devices'
import { testIDs } from '../../utils/test-ids'
import { ActionBar } from './components/action-bar'
import { PressableListItem } from './components/pressable-list-item'
import { Toast, ToastVariant } from './components/toast'
import { normalizesFilters } from './utils/inbox-filters'

type ListItem =
  | { id: string; type: 'skeleton' | 'empty' }
  | (DocumentV2 & { type: undefined })

const DEFAULT_PAGE_SIZE = 50

const LoadingWrapper = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  ${({ theme }) => isAndroid && `padding-bottom: ${theme.spacing[6]}px;`}
`

const ListHeaderWrapper = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[1]}px;
  /* To prevent flickering on android */
  min-height: 76px;
`

const TagsWrapper = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  margin-top: -4px;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[2]}px;
  flex-wrap: wrap;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'inbox.screenTitle' }),
        },
      },
      bottomTab: {
        iconColor: theme.color.blue400,
        text: intl.formatMessage({ id: 'inbox.bottomTabText' }),
      },
    }),
    {
      topBar: {
        elevation: 0,
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
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

type InboxScreenProps = {
  opened?: boolean
  archived?: boolean
  bookmarked?: boolean
  senderNationalId?: string[]
  categoryIds?: string[]
  dateFrom?: Date
  dateTo?: Date
}

export const InboxScreen: NavigationFunctionComponent<InboxScreenProps> = ({
  componentId,
  opened = false,
  archived = false,
  bookmarked = false,
  senderNationalId = [],
  categoryIds = [],
  dateFrom = undefined,
  dateTo = undefined,
}) => {
  useNavigationOptions(componentId)
  const ui = useUiStore()
  const intl = useIntl()
  const theme = useTheme()
  const scrollY = useRef(new Animated.Value(0)).current
  const flatListRef = useRef<FlatList>(null)
  const client = useApolloClient()
  const [query, setQuery] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const queryString = useThrottleState(query)
  const [refetching, setRefetching] = useState(false)
  const isFeature2WayMailboxEnabled = useFeatureFlag(
    'is2WayMailboxEnabled',
    false,
  )

  const [toastInfo, setToastInfo] = useState<{
    variant: ToastVariant
    title: string
    message?: string
  }>({
    variant: 'success',
    title: '',
  })
  const [toastVisible, setToastVisible] = useState(false)

  const pageRef = useRef(1)
  const loadingTimeout = useRef<ReturnType<typeof setTimeout>>()
  const isFilterApplied =
    opened ||
    archived ||
    bookmarked ||
    senderNationalId.length ||
    categoryIds.length ||
    dateFrom ||
    dateTo

  const incomingFilters = useMemo(() => {
    return {
      opened,
      archived,
      bookmarked,
      subjectContains: queryString,
      senderNationalId,
      categoryIds,
      dateTo,
      dateFrom,
    }
  }, [
    opened,
    archived,
    bookmarked,
    queryString,
    senderNationalId,
    categoryIds,
    dateFrom,
    dateTo,
  ])

  const [filters, setFilters] = useState(normalizesFilters(incomingFilters))
  const [selectState, setSelectedState] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const res = useListDocumentsQuery({
    variables: {
      input: {
        pageSize: DEFAULT_PAGE_SIZE,
        ...filters,
        dateFrom: dateFrom?.toISOString(),
        dateTo: dateTo?.toISOString(),
      },
    },
  })

  const [bulkSelectActionMutation, { loading: bulkSelectActionLoading }] =
    usePostMailActionMutationMutation()

  const availableSenders = res.data?.senders ?? []
  const availableCategories = useMemo(() => {
    return res.data?.categories ?? []
  }, [res.data])

  const allDocumentsSelected =
    selectedItems.length === res.data?.documentsV2?.data?.length

  const {
    rightButtons,
    leftButtons,
  }: Required<Pick<OptionsTopBar, 'rightButtons' | 'leftButtons'>> = useMemo(
    () => ({
      rightButtons: [
        {
          id: selectState
            ? ButtonRegistry.InboxBulkSelectCancelButton
            : ButtonRegistry.InboxBulkSelectButton,
          text: intl.formatMessage({
            id: selectState
              ? 'inbox.bulkSelectCancelButton'
              : 'inbox.bulkSelectButton',
          }),
        },
      ],
      leftButtons: selectState
        ? [
            {
              id: allDocumentsSelected
                ? ButtonRegistry.InboxBulkDeselectAllButton
                : ButtonRegistry.InboxBulkSelectAllButton,
              text: intl.formatMessage({
                id: allDocumentsSelected
                  ? 'inbox.bulkDeselectAllButton'
                  : 'inbox.bulkSelectAllButton',
              }),
            },
          ]
        : [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectState, allDocumentsSelected],
  )

  const [markAllAsRead, { loading: markAllAsReadLoading }] =
    useMarkAllDocumentsAsReadMutation({
      onCompleted: (result) => {
        if (result.documentsV2MarkAllAsRead?.success) {
          // If all documents are successfully marked as read, update cache to reflect that
          for (const document of res.data?.documentsV2?.data || []) {
            client.cache.modify({
              id: client.cache.identify(document),
              fields: {
                opened: () => true,
              },
            })
          }

          // Set unread count to 0 so red badge disappears
          client.cache.modify({
            fields: {
              documentsV2: (existing) => {
                return {
                  ...existing,
                  unreadCount: 0,
                }
              },
            },
          })
        }
      },
    })

  useConnectivityIndicator({
    componentId,
    queryResult: res,
    rightButtons,
    refetching: refetching || markAllAsReadLoading,
  })

  useNavigationButtonPress(({ buttonId }) => {
    switch (buttonId) {
      case ButtonRegistry.InboxBulkSelectButton:
        setSelectedState(true)
        break
      case ButtonRegistry.InboxBulkSelectCancelButton:
        resetSelectState()
        break
      case ButtonRegistry.InboxBulkSelectAllButton:
        setSelectedItems(res.data?.documentsV2?.data.map((doc) => doc.id) ?? [])
        break
      case ButtonRegistry.InboxBulkDeselectAllButton:
        setSelectedItems([])
        break
      default:
        break
    }
  }, componentId)

  useEffect(() => {
    const appliedFilters = normalizesFilters(incomingFilters)
    // deep equal incoming filters
    if (
      JSON.stringify(appliedFilters) === JSON.stringify(filters) ||
      incomingFilters === undefined
    ) {
      return
    }
    // Reset page on filter changes
    setFilters(appliedFilters)
  }, [incomingFilters, filters])

  useEffect(() => {
    // Make sure to reset select state when switching tabs
    if (ui.selectedTab !== 0 && selectState) {
      resetSelectState()
    }
  }, [ui.selectedTab, selectState])

  const items = useMemo(() => res.data?.documentsV2?.data ?? [], [res.data])
  const isSearch = ui.inboxQuery.length > 2

  const loadMore = async () => {
    if (res.loading || loadingMore) {
      return
    }

    const numItems = res.data?.documentsV2?.totalCount ?? DEFAULT_PAGE_SIZE

    // No more items left to fetch
    if (DEFAULT_PAGE_SIZE * pageRef.current > numItems) {
      return
    }
    setLoadingMore(true)

    pageRef.current = pageRef.current + 1
    const page = pageRef.current

    try {
      await res.fetchMore({
        variables: {
          input: {
            page,
            pageSize: DEFAULT_PAGE_SIZE,
            ...filters,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.documentsV2?.data?.length) {
            return prev
          }

          return {
            documentsV2: {
              ...fetchMoreResult.documentsV2,
              data: [
                ...(prev.documentsV2?.data || []),
                ...(fetchMoreResult.documentsV2?.data || []),
              ],
            },
          }
        },
      })
    } catch (e) {
      // TODO handle error
    }
    setLoadingMore(false)
  }

  const handleBulkActionError = (
    actionType: 'star' | 'archive' | 'markAsRead',
  ) => {
    showToastForBulkSelectAction({
      variant: 'error',
      title: intl.formatMessage({
        id: `inbox.bulkSelect.${actionType}Error`,
      }),
      message: intl.formatMessage({
        id: 'inbox.bulkSelect.pleaseTryAgain',
      }),
    })
  }

  const showToastForBulkSelectAction = ({
    variant,
    title,
    message,
  }: {
    variant: ToastVariant
    title: string
    message?: string
  }) => {
    setToastInfo({
      variant: variant,
      title: title,
      message: message ?? undefined,
    })
    setToastVisible(true)
  }

  useEffect(() => {
    const topBar: OptionsTopBar = {
      ...(isAndroid && {
        title: { alignment: leftButtons.length > 0 ? 'center' : 'fill' },
      }),
      rightButtons,
      leftButtons,
    }

    Navigation.mergeOptions(componentId, {
      topBar,
    })
  }, [componentId, rightButtons, leftButtons])

  useNavigationComponentDidAppear(() => {
    if (isAndroid) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          backButton: { visible: false },
        },
      })
    }
  }, componentId)

  const keyExtractor = useCallback((item: ListItem) => {
    return item.id.toString()
  }, [])

  const resetSelectState = () => {
    setSelectedItems([])
    setSelectedState(false)
  }

  const onRefresh = useCallback(async () => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setRefetching(true)
      // Reset page to 1 when refreshing
      pageRef.current = 1
      await res.refetch()
      loadingTimeout.current = setTimeout(() => {
        setRefetching(false)
      }, 1331)
    } catch (err) {
      setRefetching(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => {
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
                <Image
                  source={illustrationSrc}
                  style={{ width: 134, height: 176 }}
                  resizeMode="contain"
                />
              }
            />
          </View>
        )
      }

      const document = item as DocumentV2
      const category = availableCategories.find(
        ({ id }) => id === document?.categoryId,
      )

      return (
        <PressableListItem
          item={document}
          selectable={selectState}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setSelectedState={setSelectedState}
          isFeature2WayMailboxEnabled={isFeature2WayMailboxEnabled}
          listParams={{
            ...filters,
            category,
          }}
        />
      )
    },
    [
      intl,
      filters,
      selectState,
      selectedItems,
      setSelectedItems,
      availableCategories,
      isFeature2WayMailboxEnabled,
    ],
  )

  const data = useMemo(() => {
    if (res.loading && !res.data) {
      return Array.from({ length: 20 }).map((_, id) => ({
        id: String(id),
        type: 'skeleton',
      }))
    }
    if (items.length === 0) {
      return [{ id: '0', type: 'empty' }]
    }
    return items
  }, [res.loading, res.data, items]) as ListItem[]

  const onPressMarkAllAsRead = useCallback(() => {
    Alert.alert(
      intl.formatMessage({
        id: 'inbox.markAllAsReadPromptTitle',
      }),
      intl.formatMessage({
        id: 'inbox.markAllAsReadPromptDescription',
      }),
      [
        {
          text: intl.formatMessage({
            id: 'inbox.markAllAsReadPromptCancel',
          }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({
            id: 'inbox.markAllAsReadPromptConfirm',
          }),
          style: 'destructive',
          onPress: async () => {
            await markAllAsRead()
          },
        },
      ],
    )
  }, [markAllAsRead, intl])

  return (
    <>
      <SafeAreaView>
        <Animated.FlatList
          ref={flatListRef}
          scrollEventThrottle={16}
          scrollToOverflowEnabled
          onEndReachedThreshold={0.5}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
            },
          )}
          style={{ marginHorizontal: 0 }}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <ListHeaderWrapper>
                <SearchBar
                  placeholder={intl.formatMessage({
                    id: 'inbox.searchPlaceholder',
                  })}
                  value={query}
                  onChangeText={(text) => setQuery(text)}
                  onFocus={() => {
                    if (selectState) {
                      resetSelectState()
                    }
                  }}
                />
                <Button
                  title={intl.formatMessage({
                    id: 'inbox.filterButtonTitle',
                  })}
                  isOutlined
                  isUtilityButton
                  style={{
                    marginLeft: 8,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                  icon={filterIcon}
                  iconStyle={{ tintColor: theme.color.blue400 }}
                  onPress={() => {
                    resetSelectState()
                    navigateTo('/inbox-filter', {
                      opened,
                      archived,
                      bookmarked,
                      availableSenders,
                      availableCategories,
                      selectedSenders: senderNationalId,
                      selectedCategories: categoryIds,
                      dateFrom,
                      dateTo,
                    })
                  }}
                />
                <Button
                  icon={inboxReadIcon}
                  isUtilityButton
                  isOutlined
                  style={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 12,
                    paddingRight: 12,
                    minWidth: 40,
                  }}
                  onPress={onPressMarkAllAsRead}
                />
              </ListHeaderWrapper>
              {isFilterApplied ? (
                <TagsWrapper>
                  {opened && (
                    <Tag
                      title={intl.formatMessage({
                        id: 'inbox.filterOpenedTagTitle',
                      })}
                      closable
                      onClose={() =>
                        Navigation.updateProps(componentId, { opened: false })
                      }
                    />
                  )}
                  {archived && (
                    <Tag
                      title={intl.formatMessage({
                        id: 'inbox.filterArchivedTagTitle',
                      })}
                      closable
                      onClose={() =>
                        Navigation.updateProps(componentId, { archived: false })
                      }
                    />
                  )}
                  {bookmarked && (
                    <Tag
                      title={intl.formatMessage({
                        id: 'inbox.filterStarredTagTitle',
                      })}
                      closable
                      onClose={() =>
                        Navigation.updateProps(componentId, {
                          bookmarked: false,
                        })
                      }
                    />
                  )}
                  {!!senderNationalId.length &&
                    senderNationalId.map((senderId) => {
                      const name = availableSenders.find(
                        (sender) => sender.id === senderId,
                      )
                      return (
                        <Tag
                          key={senderId}
                          title={name?.name?.trim() ?? senderId}
                          closable
                          onClose={() =>
                            Navigation.updateProps(componentId, {
                              senderNationalId: senderNationalId.filter(
                                (id) => id !== senderId,
                              ),
                            })
                          }
                        />
                      )
                    })}
                  {!!categoryIds.length &&
                    categoryIds.map((categoryId) => {
                      const name = availableCategories.find(
                        (category) => category.id === categoryId,
                      )
                      return (
                        <Tag
                          key={categoryId}
                          title={name?.name ?? categoryId}
                          closable
                          onClose={() =>
                            Navigation.updateProps(componentId, {
                              categoryIds: categoryIds.filter(
                                (id) => id !== categoryId,
                              ),
                            })
                          }
                        />
                      )
                    })}
                  {dateFrom && (
                    <Tag
                      title={`${intl.formatMessage({
                        id: 'inbox.filterDateFromLabel',
                      })} - ${intl.formatDate(dateFrom)}`}
                      closable
                      onClose={() =>
                        Navigation.updateProps(componentId, {
                          dateFrom: undefined,
                        })
                      }
                    />
                  )}
                  {dateTo && (
                    <Tag
                      title={`${intl.formatMessage({
                        id: 'inbox.filterDateToLabel',
                      })} - ${intl.formatDate(dateTo)}`}
                      closable
                      onClose={() =>
                        Navigation.updateProps(componentId, {
                          dateTo: undefined,
                        })
                      }
                    />
                  )}
                </TagsWrapper>
              ) : null}
            </>
          }
          refreshControl={
            <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
          }
          onEndReached={() => {
            loadMore()
          }}
          ListFooterComponent={
            loadingMore && !res.error ? (
              <LoadingWrapper>
                <ActivityIndicator
                  size="small"
                  animating
                  color={theme.color.blue400}
                />
              </LoadingWrapper>
            ) : null
          }
        />
      </SafeAreaView>
      {selectState && selectedItems.length ? (
        <ActionBar
          loading={bulkSelectActionLoading}
          onClickStar={async () => {
            const result = await bulkSelectActionMutation({
              variables: {
                input: { action: 'bookmark', documentIds: selectedItems },
              },
            })

            if (result.data?.postMailActionV2?.success) {
              // If success, update selected documents to be starred in the cache
              selectedItems.forEach((id) => {
                client.cache.modify({
                  id: client.cache.identify({ __typename: 'DocumentV2', id }),
                  fields: {
                    bookmarked: () => true,
                  },
                })
              })
              resetSelectState()
              showToastForBulkSelectAction({
                variant: 'success',
                title: intl.formatMessage({
                  id: 'inbox.bulkSelect.starSuccess',
                }),
              })
            } else {
              handleBulkActionError('star')
            }
          }}
          onClickArchive={async () => {
            const result = await bulkSelectActionMutation({
              variables: {
                input: { action: 'archive', documentIds: selectedItems },
              },
            })
            if (result.data?.postMailActionV2?.success) {
              resetSelectState()
              res.refetch()
              showToastForBulkSelectAction({
                variant: 'success',
                title: intl.formatMessage({
                  id: 'inbox.bulkSelect.archiveSuccess',
                }),
              })
            } else {
              handleBulkActionError('archive')
            }
          }}
          onClickMarkAsRead={async () => {
            const result = await bulkSelectActionMutation({
              variables: {
                input: { action: 'read', documentIds: selectedItems },
              },
            })
            if (result.data?.postMailActionV2?.success) {
              // If success, update selected documents to be marked as read in the cache
              selectedItems.forEach((id) => {
                client.cache.modify({
                  id: client.cache.identify({ __typename: 'DocumentV2', id }),
                  fields: {
                    opened: () => true,
                  },
                })
              })
              resetSelectState()
              showToastForBulkSelectAction({
                variant: 'success',
                title: intl.formatMessage({
                  id: 'inbox.bulkSelect.markAsReadSuccess',
                }),
              })
            } else {
              handleBulkActionError('markAsRead')
            }
          }}
        />
      ) : null}
      <Toast
        {...toastInfo}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
      <BottomTabsIndicator index={0} total={5} />
      {!isSearch && <TopLine scrollY={scrollY} />}
    </>
  )
}

InboxScreen.options = getNavigationOptions
