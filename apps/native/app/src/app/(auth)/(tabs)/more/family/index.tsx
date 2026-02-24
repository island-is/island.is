import { useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  TouchableHighlight,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from 'styled-components/native'

import { EmptyList, FamilyMemberCard, Skeleton, TopLine, Problem } from '@/ui'
import illustrationSrc from '@/assets/illustrations/hero_spring.png'
import {
  NationalRegistryChildCustody,
  NationalRegistrySpouse,
  useNationalRegistryPersonQuery,
} from '@/graphql/types/schema'
import { formatNationalId } from '@/lib/format-national-id'
import { testIDs } from '@/utils/test-ids'
import React from 'react'

type ChildItem = NationalRegistryChildCustody & {
  type: 'custodyChild' | 'bioChild'
}

type SpouseItem = NationalRegistrySpouse & { type: 'spouse' }

type FamilyListItem =
  | ChildItem
  | SpouseItem
  | { type: 'skeleton'; id: string }
  | { type: 'empty'; id: string }

const FamilyMember = React.memo(
  ({ item }: { item: ChildItem | SpouseItem }) => {
    const theme = useTheme()
    const router = useRouter()

    return (
      <View style={{ paddingHorizontal: theme.spacing[2] }}>
        <TouchableHighlight
          underlayColor={
            theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
          }
          style={{ marginBottom: theme.spacing[2], borderRadius: 16 }}
          onPress={() => {
            router.push({
              pathname: '/(auth)/(tabs)/more/family/[type]/[nationalId]',
              params: {
                type: item.type,
                nationalId: item.nationalId,
              },
            })
          }}
        >
          <SafeAreaView>
            <FamilyMemberCard
              name={item?.fullName ?? ''}
              nationalId={formatNationalId(item?.nationalId)}
            />
          </SafeAreaView>
        </TouchableHighlight>
      </View>
    )
  },
)

export default function FamilyScreen() {
  const flatListRef = useRef<FlatList>(null)
  const [refetching, setRefetching] = useState(false)
  const intl = useIntl()
  const theme = useTheme()
  const scrollY = useRef(new Animated.Value(0)).current
  const loadingTimeout = useRef<ReturnType<typeof setTimeout>>()
  const familyRes = useNationalRegistryPersonQuery()

  const { biologicalChildren, spouse, childCustody } =
    familyRes.data?.nationalRegistryPerson || {}

  // Filter out bio children with custody so we don't show them twice
  const bioChildren = biologicalChildren?.filter(
    (child) => !childCustody?.some((c) => c.nationalId === child.nationalId),
  )

  const listOfPeople = [
    { ...(spouse ?? {}), type: 'spouse' },
    ...(childCustody ?? []).map((item: NationalRegistryChildCustody) => ({
      ...item,
      type: 'custodyChild',
    })),
    ...(bioChildren ?? []).map((item: NationalRegistryChildCustody) => ({
      ...item,
      type: 'bioChild',
    })),
  ].filter((item) => item.nationalId)

  const isSkeleton = familyRes.loading && !familyRes.data

  const onRefresh = useCallback(() => {
    try {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
      setRefetching(true)
      familyRes
        .refetch()
        .then(() => {
          loadingTimeout.current = setTimeout(() => {
            setRefetching(false)
          }, 1331)
        })
        .catch(() => {
          setRefetching(false)
        })
    } catch (err) {
      setRefetching(false)
    }
  }, [])

  const renderItem = ({ item }: { item: FamilyListItem }) => {
    if (item.type === 'skeleton') {
      return (
        <View style={{ paddingHorizontal: theme.spacing[2] }}>
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
              marginBottom: theme.spacing[2],
            }}
          />
        </View>
      )
    }

    if (item.type === 'empty') {
      return (
        <View style={{ marginTop: 80, paddingHorizontal: theme.spacing[2] }}>
          <EmptyList
            title={intl.formatMessage({ id: 'family.emptyListTitle' })}
            description={intl.formatMessage({
              id: 'family.emptyListDescription',
            })}
            image={
              <Image
                source={illustrationSrc}
                style={{ width: 270, height: 261 }}
                resizeMode="contain"
              />
            }
          />
        </View>
      )
    }

    return <FamilyMember item={item} />
  }

  const keyExtractor = useCallback(
    (item: any) => item?.nationalId ?? item?.id,
    [],
  )

  const emptyItems = [{ id: '0', type: 'empty' }]
  const skeletonItems = Array.from({ length: 3 }).map((_, id) => ({
    id: String(id),
    type: 'skeleton',
  }))

  const isEmpty = listOfPeople.length === 0

  return (
    <>
      {(familyRes.data || familyRes.loading) && (
        <Animated.FlatList
          ref={flatListRef}
          testID={testIDs.SCREEN_FAMILY_OVERVIEW}
          style={{ paddingTop: theme.spacing[2], zIndex: 9 }}
          contentInset={{ bottom: 32 }}
          contentContainerStyle={{ paddingBottom: theme.spacing[2] }}
          refreshControl={
            <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
          }
          scrollEventThrottle={16}
          scrollToOverflowEnabled
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          data={
            (isSkeleton
              ? skeletonItems
              : isEmpty
              ? emptyItems
              : listOfPeople) as FamilyListItem[]
          }
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      )}
      {familyRes.error && !familyRes.data && <Problem withContainer />}
      <TopLine scrollY={scrollY} />
    </>
  )
}
