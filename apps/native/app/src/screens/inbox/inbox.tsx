import {useQuery} from '@apollo/client';
import {
  EmptyList,
  ListItem,
  ListItemSkeleton,
  SearchHeader,
  TopLine,
} from '@ui';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  Animated,
  AppState,
  AppStateStatus,
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
  View,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {
  useNavigationSearchBarCancelPress,
  useNavigationSearchBarUpdate,
} from 'react-native-navigation-hooks/dist';
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
        searchBar: {
          placeholder: intl.formatMessage({id: 'inbox.searchPlaceholder'}),
          tintColor: theme.color.blue400,
          backgroundColor: 'transparent',
        },
        rightButtons: initialized ? getRightButtons({theme} as any) : [],
        background: {
          component:
            Platform.OS === 'android'
              ? {
                  name: ComponentRegistry.AndroidSearchBar,
                  passProps: {
                    placeholder: intl.formatMessage({
                      id: 'inbox.searchPlaceholder',
                    }),
                  },
                }
              : undefined,
        },
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

const PressableListItem = React.memo(({item}: {item: Document}) => {
  const {getOrganizationLogoUrl} = useOrganizationsStore();
  return (
    <PressableHighlight
      onPress={() => navigateTo(`/inbox/${item.id}`, {title: item.senderName})}>
      <ListItem
        title={item.senderName}
        subtitle={item.subject}
        date={new Date(item.date)}
        unread={!item.opened}
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
});

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
  const unopened = res?.data?.listDocumentsV2?.data?.filter(item => item.opened === false);
  return unopened?.length ?? 0;
};

export const InboxScreen: NavigationFunctionComponent = ({componentId}) => {
  useNavigationOptions(componentId);
  const ui = useUiStore();
  const intl = useIntl();
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const keyboardRef = useRef(false);
  const [refreshing, setRefreshing] = useState(true);
  const queryString = useThrottleState(ui.inboxQuery);
  const theme = useTheme();
  const unreadCount = useUnreadCount();
  const page = useRef(1);

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
        subjectContains: queryString?.length > 2 ? queryString : undefined,
      },
    },
    onCompleted() {
      setRefreshing(false);
    },
  });

  useEffect(() => {
    page.current = 1;
  }, [queryString]);

  const items = res?.data?.listDocumentsV2?.data ?? [];
  const isSearch = ui.inboxQuery.length > 2;

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
        });
      }
    } else {
      KeyboardManager.isKeyboardShowing().then(value => {
        if (value === true) {
          keyboardRef.current = value;
          Navigation.mergeOptions(componentId, {
            topBar: {
              searchBar: {
                visible: false,
                placeholder: intl.formatMessage({
                  id: 'inbox.searchPlaceholder',
                }),
              },
            },
          });
        }
      });
    }
  }, []);

  useActiveTabItemPress(0, () => {
    flatListRef.current?.scrollToOffset({
      offset: -200,
      animated: true,
    });
  });

  useNavigationSearchBarUpdate(e => {
    ui.setInboxQuery(e.text);
  });

  useNavigationSearchBarCancelPress(() => {
    ui.setInboxQuery('');
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
    setBadgeCountAsync(unreadCount)
  }, [intl, theme, unreadCount]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const listener = AppState.addEventListener('change', onAppStateBlur);
      return () => {
        listener.remove();
      };
    }
  }, []);

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
      return <PressableListItem item={item as Document} />;
    },
    [intl],
  );

  const data = useMemo(() => {
    if (refreshing || res.loading) {
      return Array.from({length: 20}).map((_, id) => ({
        id: String(id),
        type: 'skeleton',
      }));
    }
    if (items.length === 0) {
      return [{id: '0', type: 'empty'}];
    }
    return items;
  }, [refreshing, items, res.loading]) as ListItem[];

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
        stickyHeaderIndices={isSearch ? [0] : undefined}
        ListHeaderComponent={
          isSearch ? (
            <SearchHeader
              loadingText={intl.formatMessage({id: 'inbox.loadingText'})}
              resultText={
                items.length === 0
                  ? intl.formatMessage({id: 'inbox.noResultText'})
                  : items.length === 1
                  ? intl.formatMessage({id: 'inbox.singleResultText'})
                  : intl.formatMessage({id: 'inbox.resultText'})
              }
              count={items.length}
              loading={
                res.loading ||
                res.variables?.input.subjectContains !== ui.inboxQuery
              }
              isAndroid={Platform.OS === 'android'}
            />
          ) : undefined
        }
        refreshControl={
          isSearch ? undefined : (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                try {
                  await res?.refetch?.({
                    input: {...res.variables?.input, page: 1},
                  });
                } catch (err) {
                  // noop
                }
                setRefreshing(false);
              }}
            />
          )
        }
        onEndReached={() => {
          if (res.loading) {
            return;
          }
          page.current += 1;
          return res.fetchMore({
            variables: {
              input: {
                ...res.variables?.input,
                page: page.current,
              },
            },
          });
        }}
        onEndReachedThreshold={0.5}
      />
      <BottomTabsIndicator index={0} total={5} />
      {!isSearch && <TopLine scrollY={scrollY} />}
    </>
  );
};

InboxScreen.options = getNavigationOptions;
