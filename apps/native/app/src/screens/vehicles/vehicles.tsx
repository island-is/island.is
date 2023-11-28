import {EmptyList, Skeleton, TopLine} from '@ui';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {Animated, FlatList, Image, RefreshControl, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {useTheme} from 'styled-components/native';
import illustrationSrc from '../../assets/illustrations/moving.png';
import {BottomTabsIndicator} from '../../components/bottom-tabs-indicator/bottom-tabs-indicator';
import {useFeatureFlag} from '../../contexts/feature-flag-provider';
import {client} from '../../graphql/client';
import {
  GetUserVehiclesQuery,
  useGetUserVehiclesQuery,
} from '../../graphql/types/schema';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {testIDs} from '../../utils/test-ids';
import {VehicleItem} from './components/vehicle-item';

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({id: 'vehicles.screenTitle'}),
      },
    },
  }));

type VehicleListItem = NonNullable<
  NonNullable<GetUserVehiclesQuery['vehiclesList']>['vehicleList']
>[0];

type ListItem =
  | {
      id: number;
      __typename: 'Skeleton';
    }
  | VehicleListItem;

const Empty = () => (
  <View style={{marginTop: 80, paddingHorizontal: 16}}>
    <EmptyList
      title={<FormattedMessage id="vehicles.emptyListTitle" />}
      description={<FormattedMessage id="vehicles.emptyListDescription" />}
      image={
        <Image
          source={illustrationSrc}
          style={{width: 198, height: 146}}
          resizeMode="contain"
        />
      }
    />
  </View>
);

const SkeletonItem = () => {
  const theme = useTheme();
  return (
    <View style={{paddingHorizontal: 16}}>
      <Skeleton
        active
        backgroundColor={{
          dark: theme.shades.dark.shade300,
          light: theme.color.blue100,
        }}
        overlayColor={{
          dark: theme.shades.dark.shade200,
          light: theme.color.blue200,
        }}
        overlayOpacity={1}
        height={156}
        style={{
          borderRadius: 16,
          marginBottom: 16,
        }}
      />
    </View>
  );
};

const input = {
  page: 1,
  pageSize: 10,
  showDeregeristered: true,
  showHistory: true,
};

export const VehiclesScreen: NavigationFunctionComponent = ({componentId}) => {
  useNavigationOptions(componentId);
  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const loadingTimeout = useRef<NodeJS.Timeout>();
  const res = useGetUserVehiclesQuery({
    client,
    fetchPolicy: 'cache-first',
    variables: {
      input,
    },
  });

  // Get feature flag for mileage
  const isMileageEnabled = useFeatureFlag(
    'isServicePortalVehicleMileagePageEnabled',
    false,
  );

  // What to do when refreshing
  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      setLoading(true);
      res
        .refetch({
          input: {
            ...input,
            page: 1,
          },
        })
        .then(() => {
          loadingTimeout.current = setTimeout(() => {
            setLoading(false);
          }, 1331);
        })
        .catch(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
    }
  }, [res]);

  // Render item
  const renderItem = useCallback(
    ({item, index}: {item: ListItem; index: number}) => {
      if (item.__typename === 'Skeleton') {
        return <SkeletonItem />;
      }

      return (
        <VehicleItem mileage={isMileageEnabled} item={item} index={index} />
      );
    },
    [isMileageEnabled],
  );

  // Extract key of data
  const keyExtractor = useCallback(
    (item: ListItem, index: number) =>
      item.__typename === 'Skeleton' ? String(item.id) : `${item.vin}${index}`,
    [],
  );

  // Return skeleton items or real data
  const data = useMemo<ListItem[]>(() => {
    if (res?.loading && !res?.data) {
      return Array.from({length: 5}).map((_, id) => ({
        id,
        __typename: 'Skeleton',
      }));
    }
    return res?.data?.vehiclesList?.vehicleList || [];
  }, [res.data, res.loading]);

  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_HOME}
        style={{
          paddingTop: 16,
          zIndex: 9,
        }}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        contentInset={{
          bottom: 32,
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={Empty}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={() => {
          if (res.loading) {
            return;
          }
          const pageNumber = res.data?.vehiclesList?.paging?.pageNumber ?? 1;
          const totalPages = res.data?.vehiclesList?.paging?.totalPages ?? 1;
          if (pageNumber >= totalPages) {
            return;
          }

          return res.fetchMore({
            variables: {
              input: {
                ...input,
                page: pageNumber + 1,
              },
            },
            updateQuery(prev, {fetchMoreResult}) {
              return {
                vehiclesList: {
                  ...fetchMoreResult.vehiclesList,
                  vehicleList: [
                    ...(prev.vehiclesList?.vehicleList ?? []),
                    ...(fetchMoreResult.vehiclesList?.vehicleList ?? []),
                  ],
                },
              };
            },
          });
        }}
      />
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={2} total={3} />
    </>
  );
};

VehiclesScreen.options = getNavigationOptions;
