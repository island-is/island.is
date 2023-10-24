import {useQuery} from '@apollo/client';
import {
  Button,
  EmptyList,
  ListItem,
  ListItemSkeleton,
  SearchBar,
  TopLine,
  Tag,
  useDynamicColor,
} from '@ui';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useNavigationComponentDidAppear} from 'react-native-navigation-hooks/dist';
import {useTheme} from 'styled-components/native';
import illustrationSrc from '../../assets/illustrations/le-company-s3.png';
import {BottomTabsIndicator} from '../../components/bottom-tabs-indicator/bottom-tabs-indicator';
import {PressableHighlight} from '../../components/pressable-highlight/pressable-highlight';
import {client} from '../../graphql/client';
import {LIST_DOCUMENTS_QUERY} from '../../graphql/queries/list-documents.query';
import {useActiveTabItemPress} from '../../hooks/use-active-tab-item-press';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {navigateTo} from '../../lib/deep-linking';
import {useOrganizationsStore} from '../../stores/organizations-store';
import {useUiStore} from '../../stores/ui-store';
import {ComponentRegistry} from '../../utils/component-registry';
import {getRightButtons} from '../../utils/get-main-root';
import {testIDs} from '../../utils/test-ids';
import {
  GetDocumentListInput,
  ListDocumentsV2,
} from '../../graphql/queries/list-documents.query';
import {Document} from 'src/graphql/types/schema';
import {setBadgeCountAsync} from 'expo-notifications';
import {toggleAction} from '../../graphql/queries/inbox-actions';
import FilterIcon from '../../assets/icons/filter-icon.png';

type ListItem =
  | {id: string; type: 'skeleton' | 'empty'}
  | (Document & {type: undefined});

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
      topBar: {
        title: {
          text: intl.formatMessage({id: 'inbox.screenTitle'}),
        },
        rightButtons: initialized ? getRightButtons({theme} as any) : [],
      },
      bottomTab: {
        iconColor: theme.color.blue400,
        text: initialized
          ? intl.formatMessage({id: 'inbox.bottomTabText'})
          : '',
      },
    }),
    {
      topBar: {
        elevation: 0,
        height: 120,
        largeTitle: {
          visible: true,
        },
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
  );

const PressableListItem = React.memo(
  ({item, listParams}: {item: Document; listParams: any}) => {
    const {getOrganizationLogoUrl} = useOrganizationsStore();
    const [starred, setStarred] = useState<boolean>(!!item.bookmarked);
    useEffect(() => setStarred(!!item.bookmarked), [item.bookmarked]);
    return (
      <PressableHighlight
        onPress={() =>
          navigateTo(`/inbox/${item.id}`, {
            title: item.senderName,
            listParams,
          })
        }>
        <ListItem
          title={item.senderName}
          subtitle={item.subject}
          date={new Date(item.date)}
          unread={!item.opened}
          starred={starred}
          onStarPress={() => {
            toggleAction(!item.bookmarked ? 'bookmark' : 'unbookmark', item.id);
            setStarred(!item.bookmarked);
          }}
          icon={
            <Image
              source={getOrganizationLogoUrl(item.senderName, 75)}
              resizeMode="contain"
              style={{width: 25, height: 25}}
            />
          }
        />
      </PressableHighlight>
    );
  },
);

function useThrottleState(state: string, delay = 500) {
  const [throttledState, setThrottledState] = useState(state);
  useEffect(() => {
    const timeout = setTimeout(
      () => setThrottledState(state),
      state === '' ? 0 : delay,
    );
    return () => clearTimeout(timeout);
  }, [state, delay]);
  return throttledState;
}

const useUnreadCount = () => {
  const res = useQuery<
    {listDocumentsV2: ListDocumentsV2},
    {input: GetDocumentListInput}
  >(LIST_DOCUMENTS_QUERY, {
    client,
    fetchPolicy: 'cache-first',
    variables: {
      input: {
        page: 1,
        pageSize: 50,
        opened: false,
      },
    },
  });
  const unopened = res?.data?.listDocumentsV2?.data?.filter(
    item => item.opened === false,
  );
  return unopened?.length ?? 0;
};

type Filters = {
  opened?: boolean;
  archived?: boolean;
  bookmarked?: boolean;
  subjectContains?: string;
};

function applyFilters(filters?: Filters) {
  return {
    archived: filters?.archived ? true : undefined,
    bookmarked: filters?.bookmarked ? true : undefined,
    opened: filters?.opened ? false : undefined,
    subjectContains: filters?.subjectContains ?? '',
  };
}

function useInboxQuery(incomingFilters?: Filters) {
  const [filters, setFilters] = useState(applyFilters(incomingFilters));
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<ListDocumentsV2>();
  const [refetching, setRefetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refetcher, setRefetcher] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    const appliedFilters = applyFilters(incomingFilters);
    // deep equal incoming filters
    if (
      JSON.stringify(appliedFilters) === JSON.stringify(filters) ||
      incomingFilters === undefined
    ) {
      return;
    }
    // Reset page on filter changes
    setFilters(appliedFilters);
  }, [incomingFilters, filters]);

  useEffect(() => {
    // Reset page on filter changes
    setPage(1);
    setRefetching(true);
  }, [filters]);

  useEffect(() => {
    const numItems = data?.totalCount ?? pageSize;
    if (pageSize * (page - 1) > numItems) {
      return;
    }
    setLoading(true);
    // Fetch data
    client
      .query<{listDocumentsV2: ListDocumentsV2}>({
        query: LIST_DOCUMENTS_QUERY,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            page,
            pageSize,
            ...filters,
          },
        },
      })
      .then(res => {
        if (page > 1) {
          setData(prevData => ({
            data: [...(prevData?.data ?? []), ...res.data.listDocumentsV2.data],
            totalCount: res.data.listDocumentsV2.totalCount,
          }));
        } else {
          setData(res.data.listDocumentsV2);
        }
      })
      .finally(() => {
        setRefetching(false);
        setLoading(false);
      });
  }, [filters, page, refetcher]);

  const loadMore = () => {
    if (loading) {
      return;
    }
    setPage(prevPage => prevPage + 1);
  };

  const refetch = () => {
    setRefetching(true);
    setPage(1);
    setRefetcher(prev => prev + 1);
  };

  return {
    data,
    page,
    pageSize,
    filters,
    loading,
    refetching,
    refetch,
    loadMore,
  };
}

export const InboxScreen: NavigationFunctionComponent<{
  opened?: boolean;
  archived?: boolean;
  bookmarked?: boolean;
  refresh?: number;
}> = ({
  componentId,
  opened = false,
  archived = false,
  bookmarked = false,
  refresh,
}) => {
  useNavigationOptions(componentId);
  const ui = useUiStore();
  const intl = useIntl();
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const keyboardRef = useRef(false);
  const [query, setQuery] = useState('');
  const queryString = useThrottleState(query);
  const theme = useTheme();
  const unreadCount = useUnreadCount();
  const [visible, setVisible] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const dynamicColor = useDynamicColor();

  const res = useInboxQuery({
    opened,
    archived,
    bookmarked,
    subjectContains: queryString,
  });

  useEffect(() => {
    setRefetching(false);
  }, [res.refetching]);

  useEffect(() => {
    res.refetch();
  }, [refresh]);

  const items = res.data?.data ?? [];
  const isSearch = ui.inboxQuery.length > 2;

  useActiveTabItemPress(0, () => {
    flatListRef.current?.scrollToOffset({
      offset: -200,
      animated: true,
    });
  });

  useEffect(() => {
    Navigation.mergeOptions(ComponentRegistry.InboxScreen, {
      bottomTab: {
        iconColor: theme.color.blue400,
        textColor: theme.shade.foreground,
        text: intl.formatMessage({id: 'inbox.bottomTabText'}),
        testID: testIDs.TABBAR_TAB_INBOX,
        iconInsets: {
          bottom: -4,
        },
        icon: require('../../assets/icons/tabbar-inbox.png'),
        selectedIcon: require('../../assets/icons/tabbar-inbox-selected.png'),
        badge: unreadCount > 0 ? unreadCount.toString() : (null as any),
        badgeColor: theme.color.red400,
      },
    });
    setBadgeCountAsync(unreadCount);
  }, [intl, theme, unreadCount]);

  const keyExtractor = useCallback((item: ListItem) => {
    return item.id;
  }, []);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ListItem>) => {
      if (item.type === 'skeleton') {
        return <ListItemSkeleton />;
      }
      if (item.type === 'empty') {
        return (
          <View style={{marginTop: 80}}>
            <EmptyList
              title={intl.formatMessage({id: 'inbox.emptyListTitle'})}
              description={intl.formatMessage({
                id: 'inbox.emptyListDescription',
              })}
              image={
                <Image
                  source={illustrationSrc}
                  style={{width: 134, height: 176}}
                  resizeMode="contain"
                />
              }
            />
          </View>
        );
      }
      return (
        <PressableListItem
          item={item as Document}
          listParams={{
            ...res.filters,
          }}
        />
      );
    },
    [intl, res.filters],
  );

  const data = useMemo(() => {
    if (res.refetching) {
      return Array.from({length: 20}).map((_, id) => ({
        id: String(id),
        type: 'skeleton',
      }));
    }
    if (items.length === 0) {
      return [{id: '0', type: 'empty'}];
    }
    return items;
  }, [res.refetching, items]) as ListItem[];

  useNavigationComponentDidAppear(() => {
    setVisible(true);
  }, componentId);

  if (!visible) {
    return null;
  }

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
        style={{marginHorizontal: 0, flex: 1}}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View
              style={{
                padding: 16,
                flexDirection: 'row',
                gap: 15,
              }}>
              <SearchBar
                placeholder={intl.formatMessage({
                  id: 'inbox.searchPlaceholder',
                })}
                value={query}
                onChangeText={text => setQuery(text)}
              />
              <Button
                title={intl.formatMessage({
                  id: 'inbox.filterButtonTitle',
                })}
                isOutlined
                style={{
                  minWidth: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  minHeight: 0,
                  borderColor: dynamicColor({
                    light: '#CCDFFF',
                    dark: '#CCDFFF55',
                  }),
                }}
                icon={FilterIcon}
                iconStyle={{tintColor: theme.color.blue400}}
                textStyle={{
                  fontSize: 12,
                  color: dynamicColor({
                    light: '#00003C',
                    dark: '#fff',
                  }),
                }}
                onPress={() => {
                  navigateTo('/inbox-filter', {
                    opened,
                    archived,
                    bookmarked,
                  });
                }}
              />
            </View>
            {opened || archived || bookmarked ? (
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                  marginTop: -4,
                  flexDirection: 'row',
                  gap: 15,
                }}>
                {opened && (
                  <Tag
                    title={intl.formatMessage({
                      id: 'inbox.filterOpenedTagTitle',
                    })}
                    closable
                    onClose={() =>
                      Navigation.updateProps(componentId, {opened: false})
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
                      Navigation.updateProps(componentId, {archived: false})
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
                      Navigation.updateProps(componentId, {bookmarked: false})
                    }
                  />
                )}
              </View>
            ) : null}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refetching}
            onRefresh={() => {
              setRefetching(true);
              res.refetch();
            }}
          />
        }
        onEndReached={() => {
          res.loadMore();
        }}
        onEndReachedThreshold={0.5}
      />
      <BottomTabsIndicator index={0} total={5} />
      {!isSearch && <TopLine scrollY={scrollY} />}
    </>
  );
};

InboxScreen.options = getNavigationOptions;
