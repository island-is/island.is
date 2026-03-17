import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  Pressable,
  RefreshControl,
  ToastAndroid,
  TouchableNativeFeedback,
  useWindowDimensions,
  View,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import starIcon from '@/assets/icons/star.png'
import { useApolloClient } from '@apollo/client'
import filterIcon from '@/assets/icons/filter-icon.png'
import inboxReadIcon from '@/assets/icons/inbox-read.png'
import illustrationSrc from '@/assets/illustrations/le-company-s3.png'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import {
  DocumentCategory,
  DocumentV2,
  useListDocumentsQuery,
  useMarkAllDocumentsAsReadMutation,
  usePostMailActionMutationMutation,
} from '@/graphql/types/schema'
import { useThrottleState } from '@/hooks/use-throttle-state'
import { router, Stack } from 'expo-router'
import {
  inboxFilterStore,
  useInboxFilterStore,
} from '@/stores/inbox-filter-store'
import {
  blue400,
  Button,
  EmptyList,
  fontByWeight,
  ListItemSkeleton,
  SearchBar,
  Tag,
  TopLine,
  Typography,
} from '@/ui'
import { isAndroid } from '@/utils/devices'
import { testIDs } from '@/utils/test-ids'
import { ActionBar } from '../../../../components/action-bar'
import { PressableListItem } from '../../../../components/pressable-list-item'
import { Toast, ToastVariant } from '../../../../components/toast'
import { normalizesFilters } from '../../../../utils/inbox-filters'
import { Text } from 'react-native'
import { StackScreen } from '../../../../components/stack-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { uiStore } from '../../../../stores/ui-store'
import * as Burnt from 'burnt'

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

const Action = ({
  icon,
  label,
  onPress,
}: {
  icon: number
  label: string
  onPress: () => void
}) => {
  const { width } = useWindowDimensions()
  const { left, right } = useSafeAreaInsets()
  const itemWidth = (width - left - right) / 3 - 32
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: itemWidth,
        height: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <Image
        source={icon}
        style={{
          width: 16,
          height: 16,
          tintColor: blue400,
        }}
        resizeMode="contain"
      />
      <Typography size={13} weight="500">
        {label}
      </Typography>
    </Pressable>
  )
}

export default function InboxScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const client = useApolloClient()
  const [query, setQuery] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const queryString = useThrottleState(query)
  const [refetching, setRefetching] = useState(false)
  const isFeature2WayMailboxEnabled = useFeatureFlag(
    'is2WayMailboxEnabled',
    false,
  )

  // Filter state (shared with filter screen via store)
  const {
    opened,
    archived,
    bookmarked,
    senderNationalId,
    categoryIds,
    dateFrom,
    dateTo,
  } = useInboxFilterStore()

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

  const filters = useMemo(
    () =>
      normalizesFilters({
        opened,
        archived,
        bookmarked,
        subjectContains: queryString,
        senderNationalId,
        categoryIds,
        dateTo,
        dateFrom,
      }),
    [
      opened,
      archived,
      bookmarked,
      queryString,
      senderNationalId,
      categoryIds,
      dateFrom,
      dateTo,
    ],
  )

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

  const availableSenders = res.data?.documentsV2?.senders ?? []

  const availableCategories = useMemo(() => {
    return res.data?.documentsV2?.categories ?? []
  }, [res.data])

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

  const items = useMemo(() => res.data?.documentsV2?.data ?? [], [res.data])
  const isSearch = query.length > 2

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
      title: `${intl.formatMessage({
        id: `inbox.bulkSelect.${actionType}Error`,
      })}: ${intl.formatMessage({
        id: 'inbox.bulkSelect.pleaseTryAgain',
      })}`,
    })
  }

  const showToastForBulkSelectAction = ({
    variant,
    title,
  }: {
    variant: ToastVariant
    title: string
  }) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(title, ToastAndroid.SHORT)
    } else {
      Burnt.toast({
        title,
        preset:
          variant === 'success'
            ? 'done'
            : variant === 'error'
            ? 'error'
            : 'none',
        from: 'bottom',
      })
    }
  }

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
      ) as DocumentCategory

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

  const onMarkAllAsReadPress = useCallback(() => {
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

  const onStarPress = useCallback(async () => {
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
  }, [selectedItems, bulkSelectActionMutation, client, intl])

  const onArchivePress = useCallback(async () => {
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
  }, [selectedItems, bulkSelectActionMutation, res, intl])

  const onMarkAsReadPress = useCallback(async () => {
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
  }, [selectedItems, bulkSelectActionMutation, client, intl])

  useEffect(() => {
    uiStore.setState({ tabsHidden: selectState && !!selectedItems.length })
  }, [selectState, selectedItems.length])

  return (
    <>
      <StackScreen
        networkStatus={[res.networkStatus]}
        options={{
          headerTitleAlign: 'center',
          headerLeftItems: selectState
            ? [
                {
                  type: 'button',
                  label: intl.formatMessage({
                    id: allDocumentsSelected
                      ? 'inbox.bulkDeselectAllButton'
                      : 'inbox.bulkSelectAllButton',
                  }),
                  labelStyle: {
                    fontSize: 15,
                    fontWeight: '400',
                    fontFamily: fontByWeight('400'),
                  },
                  onPress() {
                    allDocumentsSelected
                      ? setSelectedItems([])
                      : setSelectedItems(
                          res.data?.documentsV2?.data.map((doc) => doc.id) ??
                            [],
                        )
                  },
                },
              ]
            : [
                {
                  type: 'button',
                  label: intl.formatMessage({
                    id: 'inbox.bulkSelectButton',
                  }),
                  labelStyle: {
                    fontSize: 15,
                    fontWeight: '400',
                    fontFamily: fontByWeight('400'),
                  },
                  onPress() {
                    setSelectedState((v) => !v)
                  },
                },
              ],
          headerRightItems: selectState
            ? [
                {
                  type: 'button',
                  label: intl.formatMessage({
                    id: 'inbox.bulkSelectCancelButton',
                  }),
                  labelStyle: {
                    fontSize: 15,
                    fontWeight: '400',
                    fontFamily: fontByWeight('400'),
                  },
                  onPress() {
                    resetSelectState()
                  },
                  tintColor: theme.color.purple400,
                },
              ]
            : [],
        }}
      />
      {selectState && selectedItems.length ? (
        <Stack.Toolbar placement="bottom">
          <Stack.Toolbar.View separateBackground>
            <Action
              icon={require('@/assets/icons/star.png')}
              label={intl.formatMessage({
                id: 'inbox.bulkSelectActionStar',
                defaultMessage: 'Stjörnumerkja',
              })}
              onPress={onStarPress}
            />
          </Stack.Toolbar.View>
          <Stack.Toolbar.View separateBackground>
            <Action
              icon={require('@/assets/icons/tray.png')}
              label={intl.formatMessage({
                id: 'inbox.bulkSelectActionArchive',
                defaultMessage: 'Geymsla',
              })}
              onPress={onArchivePress}
            />
          </Stack.Toolbar.View>
          <Stack.Toolbar.View separateBackground>
            <Action
              icon={require('@/assets/icons/inbox-read.png')}
              label={intl.formatMessage({
                id: 'inbox.bulkSelectActionRead',
                defaultMessage: 'Merkja lesið',
              })}
              onPress={onMarkAsReadPress}
            />
          </Stack.Toolbar.View>
        </Stack.Toolbar>
      ) : null}
      <Animated.FlatList
        testID={testIDs.SCREEN_HOME}
        scrollToOverflowEnabled
        onEndReachedThreshold={0.5}
        style={{ flex: 1 }}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <>
            <ListHeaderWrapper>
              <SearchBar
                placeholder={intl.formatMessage({
                  id: 'inbox.searchPlaceholder',
                })}
                value={query}
                onChangeText={(text) => setQuery(text)}
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
                  inboxFilterStore.setState({
                    availableSenders,
                    availableCategories,
                  })
                  router.push('/inbox/filter')
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
                onPress={onMarkAllAsReadPress}
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
                    onClose={() => inboxFilterStore.setState({ opened: false })}
                  />
                )}
                {archived && (
                  <Tag
                    title={intl.formatMessage({
                      id: 'inbox.filterArchivedTagTitle',
                    })}
                    closable
                    onClose={() =>
                      inboxFilterStore.setState({ archived: false })
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
                      inboxFilterStore.setState({ bookmarked: false })
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
                          inboxFilterStore.setState((state) => ({
                            senderNationalId: state.senderNationalId.filter(
                              (id) => id !== senderId,
                            ),
                          }))
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
                          inboxFilterStore.setState((state) => ({
                            categoryIds: state.categoryIds.filter(
                              (id) => id !== categoryId,
                            ),
                          }))
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
                      inboxFilterStore.setState({ dateFrom: undefined })
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
                      inboxFilterStore.setState({ dateTo: undefined })
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
        onEndReached={() => loadMore()}
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
      {selectState && selectedItems.length && Platform.OS === 'android' ? (
        <ActionBar
          loading={bulkSelectActionLoading}
          onClickStar={onStarPress}
          onClickArchive={onArchivePress}
          onClickMarkAsRead={onMarkAsReadPress}
        />
      ) : null}
    </>
  )
}
