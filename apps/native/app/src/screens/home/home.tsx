// import {useQuery} from '@apollo/client';
import {TopLine} from '@ui';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
} from 'react-native';
import CodePush from 'react-native-code-push';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {BottomTabsIndicator} from '../../components/bottom-tabs-indicator/bottom-tabs-indicator';
import {useActiveTabItemPress} from '../../hooks/use-active-tab-item-press';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {notificationsStore} from '../../stores/notifications-store';
import {useUiStore} from '../../stores/ui-store';
import {getRightButtons} from '../../utils/get-main-root';
import {testIDs} from '../../utils/test-ids';
import {ApplicationsModule} from './applications-module';
import {NotificationsModule} from './notifications-module';
import {OnboardingModule} from './onboarding-module';
import {Application, useListApplicationsQuery} from '../../graphql/types/schema';

interface ListItem {
  id: string;
  component: ReactElement;
}

const iconInsets = {
  top: Platform.OS === 'ios' && Platform.isPad ? 8 : 16,
  bottom: Platform.OS === 'ios' && Platform.isPad ? 8 : -4,
};

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
      topBar: {
        title: {
          text: initialized ? intl.formatMessage({id: 'home.screenTitle'}) : '',
        },
        rightButtons: initialized ? getRightButtons({theme} as any) : [],
      },
      bottomTab: {
        ...({
          accessibilityLabel: intl.formatMessage({id: 'home.screenTitle'}),
        } as any),
        // selectedIconColor: null as any,
        // iconColor: null as any,
        textColor: initialized
          ? Platform.OS === 'android'
            ? theme.shade.foreground
            : {light: 'black', dark: 'white'}
          : theme.shade.background,
        icon: initialized
          ? require('../../assets/icons/tabbar-home.png')
          : undefined,
        selectedIcon: initialized
          ? require('../../assets/icons/tabbar-home-selected.png')
          : undefined,
      },
    }),
    {
      topBar: {
        rightButtons: [],
        largeTitle: {
          visible: true,
        },
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_HOME,
        iconInsets,
        disableIconTint: false,
        disableSelectedIconTint: true,
        iconColor: null as any,
        selectedIconColor: null as any,
      },
    },
  );

export const MainHomeScreen: NavigationFunctionComponent = ({componentId}) => {
  useNavigationOptions(componentId);
  const flatListRef = useRef<FlatList>(null);
  const ui = useUiStore();

  useActiveTabItemPress(2, () => {
    flatListRef.current?.scrollToOffset({offset: -150, animated: true});
  });

  const applicationsRes = useListApplicationsQuery();

  const [loading, setLoading] = useState(false);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ListItem>) => item.component,
    [],
  );
  const keyExtractor = useCallback((item: ListItem) => item.id, []);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sync push tokens
    notificationsStore.getState().actions.syncToken();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      await applicationsRes.refetch();
    } catch (err) {
      // noop
    }
    setLoading(false);
  };

  if (!ui.initializedApp) {
    return null;
  }

  const data = [
    {
      id: 'onboarding',
      component: <OnboardingModule />,
    },
    {
      id: 'applications',
      component: (
        <ApplicationsModule
          applications={(applicationsRes.data?.applicationApplications ?? []) as Application[]}
          loading={applicationsRes.loading}
          componentId={componentId}
        />
      ),
    },
    {
      id: 'notifications',
      component: <NotificationsModule componentId={componentId} />,
    },
  ];

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        keyExtractor={keyExtractor}
        contentInset={{
          bottom: 32,
        }}
        data={data}
        renderItem={renderItem}
        style={{flex: 1}}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={2} total={5} />
    </>
  );
};

MainHomeScreen.options = getNavigationOptions;

export const HomeScreen = CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
})(MainHomeScreen);

HomeScreen.options = MainHomeScreen.options;
