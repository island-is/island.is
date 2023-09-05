import {useQuery} from '@apollo/client';
import {
  dynamicColor,
  EmptyList,
  FamilyMemberCard,
  Skeleton,
  TopLine,
} from '@ui';
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
import {client} from '../../graphql/client';
import {useIntl} from 'react-intl';
import {useTheme} from 'styled-components/native';
import {testIDs} from '../../utils/test-ids';
import illustrationSrc from '../../assets/illustrations/hero_spring.png';
import {BottomTabsIndicator} from '../../components/bottom-tabs-indicator/bottom-tabs-indicator';
import {navigateTo} from '../../lib/deep-linking';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {FAMILY_QUERY} from '../../graphql/queries/list-family-query';
import {formatNationalId} from '../more/personal-info-content';

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({id: 'family.screenTitle'}),
      },
    },
  }));

const FamilyMember = React.memo(({item}: {item: any}) => {
  const theme = useTheme();

  return (
    <View style={{paddingHorizontal: 16}}>
      <TouchableHighlight
        underlayColor={
          theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
        }
        style={{marginBottom: 16, borderRadius: 16}}
        onPress={() => {
          navigateTo(`/family/${item.type}/${item.nationalId}`, {
            id: item?.nationalId,
          });
        }}>
        <SafeAreaView>
          <FamilyMemberCard
            name={item?.name || item?.displayName}
            nationalId={formatNationalId(item?.nationalId)}
          />
        </SafeAreaView>
      </TouchableHighlight>
    </View>
  );
});

export const FamilyOverviewScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId);
  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const loadingTimeout = useRef<number>();

  const familyRes = useQuery(FAMILY_QUERY, {
    client,
    fetchPolicy: 'network-only',
  });
  const {nationalRegistryUser, nationalRegistryChildren = []} =
    familyRes?.data || {};

  const listOfPeople = [
    {...(nationalRegistryUser?.spouse ?? {}), type: 'spouse'},
    ...(nationalRegistryChildren ?? []).map((item: any) => ({
      ...item,
      type: 'child',
    })),
  ].filter(item => item.nationalId);

  const isSkeleton = familyRes.loading && !familyRes.data;

  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      setLoading(true);
      familyRes
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

  const renderItem = ({item}: {item: any}) => {
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
            height={104}
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
            title={intl.formatMessage({id: 'family.emptyListTitle'})}
            description={intl.formatMessage({
              id: 'family.emptyListDescription',
            })}
            image={
              <Image
                source={illustrationSrc}
                style={{width: 270, height: 261}}
                resizeMode="contain"
              />
            }
          />
        </View>
      );
    }

    return <FamilyMember item={item} />;
  };

  const keyExtractor = useCallback(
    (item: any) => item?.nationalId ?? item?.id,
    [],
  );

  const emptyItems = [{id: '0', type: 'empty'}];
  const skeletonItems = Array.from({length: 3}).map((_, id) => ({
    id,
    type: 'skeleton',
  }));

  const isEmpty = listOfPeople.length === 0;
  return (
    <>
      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_FAMILY_OVERVIEW}
        style={{
          paddingTop: 16,
          zIndex: 9,
        }}
        contentInset={{
          bottom: 32,
        }}
        contentContainerStyle={{
          paddingBottom: 16,
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
        data={isSkeleton ? skeletonItems : isEmpty ? emptyItems : listOfPeople}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={2} total={3} />
    </>
  );
};

FamilyOverviewScreen.options = getNavigationOptions;
