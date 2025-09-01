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
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks'
import styled, { useTheme } from 'styled-components/native'

import { useApolloClient } from '@apollo/client'
import filterIcon from '../../assets/icons/filter-icon.png'
import inboxReadIcon from '../../assets/icons/inbox-read.png'
import illustrationSrc from '../../assets/illustrations/le-company-s3.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  DocumentCategory,
  DocumentV2,
  useGetDocumentsCategoriesAndSendersQuery,
  useListDocumentsQuery,
  useMarkAllDocumentsAsReadMutation,
  usePostMailActionMutationMutation,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { useUiStore } from '../../stores/ui-store'
import {
  Button,
  EmptyList,
  InboxCard,
  ListItem,
  ListItemSkeleton,
  SearchBar,
  Tag,
  TopLine,
} from '../../ui'
import {
  ButtonRegistry,
  ComponentRegistry,
} from '../../utils/component-registry'
import { isAndroid } from '../../utils/devices'
import { testIDs } from '../../utils/test-ids'
import { ActionBar } from './components/action-bar'
import { Toast, ToastVariant } from './components/toast'

type ListItem =
  | { id: string; type: 'skeleton' | 'empty' }
  | (DocumentV2 & { type: undefined })

type Filters = {
  opened?: boolean
  archived?: boolean
  bookmarked?: boolean
  subjectContains?: string
  senderNationalId?: string[]
  categoryIds?: string[]
  dateFrom?: Date
  dateTo?: Date
}

export type ListParams = Filters & { category?: DocumentCategory }

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

const PressableListItem = React.memo(
  ({
    item,
    listParams,
    selectable,
    selectedItems,
    setSelectedItems,
    setSelectedState,
    isFeature2WayMailboxEnabled,
  }: {
    item: DocumentV2
    listParams: ListParams
    selectable: boolean
    selectedItems: string[]
    setSelectedItems: (items: string[]) => void
    setSelectedState: (state: boolean) => void
    isFeature2WayMailboxEnabled: boolean
  }) => {
    const { getOrganizationLogoUrl } = useOrganizationsStore()
    const isSelected = selectable && selectedItems.includes(item.id)

    return (
      <InboxCard
        key={item.id}
        subject={item.subject}
        publicationDate={item.publicationDate}
        id={item.id}
        unread={!item.opened}
        senderName={item.sender.name}
        icon={item.sender.name && getOrganizationLogoUrl(item.sender.name, 75)}
        isUrgent={item.isUrgent}
        replyable={isFeature2WayMailboxEnabled ? item.replyable : false}
        bookmarked={item.bookmarked}
        selectable={selectable}
        selected={isSelected}
        onPressIcon={() => {
          setSelectedState(true)
          setSelectedItems([...selectedItems, item.id])
        }}
        onPress={() =>
          selectable
            ? isSelected
              ? setSelectedItems(selectedItems.filter((id) => id !== item.id))
              : setSelectedItems([...selectedItems, item.id])
            : navigateTo(`/inbox/${item.id}`, {
                title: item.sender.name,
                isUrgent: item.isUrgent,
                listParams,
              })
        }
      />
    )
  },
)

function useThrottleState(state: string, delay = 500) {
  const [throttledState, setThrottledState] = useState(state)
  useEffect(() => {
    const timeout = setTimeout(
      () => setThrottledState(state),
      state === '' ? 0 : delay,
    )
    return () => clearTimeout(timeout)
  }, [state, delay])
  return throttledState
}

function applyFilters(filters?: Filters) {
  return {
    archived: filters?.archived ? true : undefined,
    bookmarked: filters?.bookmarked ? true : undefined,
    opened: filters?.opened ? false : undefined,
    subjectContains: filters?.subjectContains ?? '',
    senderNationalId: filters?.senderNationalId ?? [],
    categoryIds: filters?.categoryIds ?? [],
    dateFrom: filters?.dateFrom,
    dateTo: filters?.dateTo,
  }
}

export const InboxScreen: NavigationFunctionComponent<{
  opened?: boolean
  archived?: boolean
  bookmarked?: boolean
  senderNationalId?: string[]
  categoryIds?: string[]
  dateFrom?: Date
  dateTo?: Date
}> = ({
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

  const [filters, setFilters] = useState(applyFilters(incomingFilters))
  const [selectState, setSelectedState] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const rightButtons = selectState
    ? [
        {
          id: ButtonRegistry.InboxBulkSelectCancelButton,
          text: intl.formatMessage({
            id: 'inbox.bulkSelectCancelButton',
          }),
        },
      ]
    : [
        {
          id: ButtonRegistry.InboxBulkSelectButton,
          text: intl.formatMessage({
            id: 'inbox.bulkSelectButton',
          }),
        },
      ]

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

  const sendersAndCategories = useGetDocumentsCategoriesAndSendersQuery()

  const availableSenders = sendersAndCategories.data?.getDocumentSenders ?? []
  const availableCategories =
    sendersAndCategories.data?.getDocumentCategories ?? []
  const allDocumentsSelected =
    selectedItems.length === res.data?.documentsV2?.data?.length

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

  const unreadCount = res?.data?.documentsV2?.unreadCount ?? 0

  useConnectivityIndicator({
    componentId,
    queryResult: res,
    rightButtons: rightButtons,
    refetching: refetching || markAllAsReadLoading,
  })

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === ButtonRegistry.InboxBulkSelectButton) {
      setSelectedState(true)
    }
    if (buttonId === ButtonRegistry.InboxBulkSelectCancelButton) {
      resetSelectState()
    }
    if (buttonId === ButtonRegistry.InboxBulkSelectAllButton) {
      setSelectedItems(res.data?.documentsV2?.data.map((doc) => doc.id) ?? [])
    }
    if (buttonId === ButtonRegistry.InboxBulkDeselectAllButton) {
      setSelectedItems([])
    }
  }, componentId)

  useEffect(() => {
    const appliedFilters = applyFilters(incomingFilters)
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

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        leftButtons: selectState
          ? allDocumentsSelected
            ? [
                {
                  id: ButtonRegistry.InboxBulkDeselectAllButton,
                  text: intl.formatMessage({
                    id: 'inbox.bulkDeselectAllButton',
                  }),
                },
              ]
            : [
                {
                  id: ButtonRegistry.InboxBulkSelectAllButton,
                  text: intl.formatMessage({
                    id: 'inbox.bulkSelectAllButton',
                  }),
                },
              ]
          : [],
      },
    })
  }, [componentId, intl, selectState, allDocumentsSelected])

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
    Navigation.mergeOptions(ComponentRegistry.InboxScreen, {
      bottomTab: {
        iconColor: theme.color.blue400,
        textColor: theme.shade.foreground,
        text: intl.formatMessage({ id: 'inbox.bottomTabText' }),
        testID: testIDs.TABBAR_TAB_INBOX,
        iconInsets: {
          bottom: -4,
        },
        icon: require('../../assets/icons/tabbar-inbox.png'),
        selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
        badge: unreadCount > 0 ? unreadCount.toString() : (null as any),
        badgeColor: theme.color.red400,
      },
      topBar: {
        rightButtons: selectState
          ? [
              {
                id: ButtonRegistry.InboxBulkSelectCancelButton,
                text: intl.formatMessage({
                  id: 'inbox.bulkSelectCancelButton',
                }),
              },
            ]
          : [
              {
                id: ButtonRegistry.InboxBulkSelectButton,
                text: intl.formatMessage({
                  id: 'inbox.bulkSelectButton',
                }),
              },
            ],
      },
    })
  }, [intl, theme, unreadCount, selectState])

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

  const onPressMarkAllAsRead = () => {
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
  }

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
