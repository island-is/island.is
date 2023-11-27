import {useQuery} from '@apollo/client';
import {EmptyList, Label, Skeleton, TopLine, VehicleCard} from '@ui';
import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  TouchableHighlight,
  View,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {GET_USERS_VEHICLES} from '../../graphql/queries/get-users-vehicles.query';
import {client} from '../../graphql/client';
import {FormattedDate, useIntl} from 'react-intl';
import {useTheme} from 'styled-components/native';
import {testIDs} from '../../utils/test-ids';
import illustrationSrc from '../../assets/illustrations/moving.png';
import {BottomTabsIndicator} from '../../components/bottom-tabs-indicator/bottom-tabs-indicator';
import {navigateTo} from '../../lib/deep-linking';
import {translateType} from './vehicles-mapper';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({id: 'vehicles.screenTitle'}),
      },
    },
  }));

function differenceInMonths(a: Date, b: Date) {
  return a.getMonth() - b.getMonth() + 12 * (a.getFullYear() - b.getFullYear());
}

const VehicleItem = React.memo(({item,index}: {item: any;index:number}) => {
  const theme = useTheme();
  const nextInspection = item?.nextInspection?.nextInspectionDate
    ? new Date(item?.nextInspection.nextInspectionDate)
    : null;

  const vehicleCode = item.vehGroup?.split('(')[1]?.split(')')[0] ?? 'AA'; // type from vehgroup = "Vörubifreið II (N3)" = N3 otherwise AA is default

  const isInspectionDeadline =
    (nextInspection
      ? differenceInMonths(new Date(nextInspection), new Date())
      : 0) < 0

  const isMileageRequired = index === 0;

  return (
    <View style={{paddingHorizontal: 16}}>
      <TouchableHighlight
        underlayColor={
          theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
        }
        style={{marginBottom: 16, borderRadius: 16}}
        onPress={() => {
          navigateTo(`/vehicle/`, {
            id: item.permno,
            title: item.type,
          });
        }}>
        <SafeAreaView>
          <VehicleCard
            title={item.type}
            color={item.color}
            date={nextInspection}
            number={item.regno}
            label={
              isInspectionDeadline && nextInspection ? (
                <Label color="warning" icon>Næsta skoðun <FormattedDate value={nextInspection} /></Label>
              ) : isMileageRequired ? (
                <Label color="warning" icon>Skrá þarf kílómetrastöðu</Label>
              ) : null
            }
          />
        </SafeAreaView>
      </TouchableHighlight>
    </View>
  );
});

export const VehiclesScreen: NavigationFunctionComponent = ({componentId}) => {
  useNavigationOptions(componentId);
  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const loadingTimeout = useRef<number>();
  const vehiclesRes = useQuery(GET_USERS_VEHICLES, {
    client,
    fetchPolicy: 'cache-first',
  });
  const isSkeleton = vehiclesRes?.loading && !vehiclesRes?.data;

  const vehicleList = vehiclesRes?.data?.vehiclesList?.vehicleList || [];

  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      setLoading(true);
      vehiclesRes
        .refetch()
        .then(() => {
          (loadingTimeout as any).current = setTimeout(() => {
            setLoading(false);
          }, 1331);
        })
        .catch(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
    }
  }, []);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    if (item.type === 'skeleton') {
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
    }

    if (item.type === 'empty') {
      return (
        <View style={{marginTop: 80, paddingHorizontal: 16}}>
          <EmptyList
            title={intl.formatMessage({id: 'vehicles.emptyListTitle'})}
            description={intl.formatMessage({
              id: 'vehicles.emptyListDescription',
            })}
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
    }

    return <VehicleItem item={item} index={index} />;
  };

  const keyExtractor = useCallback((item: any) => item?.vin ?? item?.id, []);

  const emptyItems = [{id: '0', type: 'empty'}];
  const skeletonItems = Array.from({length: 5}).map((_, id) => ({
    id,
    type: 'skeleton',
  }));

  const isEmpty = vehicleList.length === 0;
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
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
        data={isSkeleton ? skeletonItems : isEmpty ? emptyItems : vehicleList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={2} total={3} />
    </>
  );
};

VehiclesScreen.options = getNavigationOptions;
