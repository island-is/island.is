import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Animated, Image, RefreshControl, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import illustrationSrc from '@/assets/illustrations/le-jobs-s3.png'
import {
  Application,
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { EmptyList, StatusCardSkeleton, TopLine } from '@/ui'
import { ApplicationsPreview } from '../../../../../components/applications-preview'
import { sortApplicationsStatus } from '../../../../../utils/applications/sort-applications-status'

const Host = styled.View`
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

export default function ApplicationsScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const [refetching, setRefetching] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current
  const applicationsRes = useListApplicationsQuery({
    variables: { locale: useLocale() },
  })

  const applications = useMemo(
    () => applicationsRes.data?.applicationApplications ?? [],
    [applicationsRes],
  )

  const sortedApplications = useMemo(
    () => sortApplicationsStatus(applications as Application[]),
    [applications],
  )

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      await applicationsRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [applicationsRes])

  return (
    <Host>
      <Animated.ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
      >
        {!applications.length && !applicationsRes.loading ? (
          <View style={{ marginTop: 80, paddingHorizontal: 16 }}>
            <EmptyList
              title={intl.formatMessage({ id: 'applications.emptyTitle' })}
              description={intl.formatMessage({
                id: 'applications.emptyDescription',
              })}
              image={
                <Image
                  source={illustrationSrc}
                  style={{ height: 210, width: 167 }}
                />
              }
            />
          </View>
        ) : null}
        {applicationsRes.loading &&
          !applicationsRes.data &&
          Array.from({ length: 3 }).map((_, index) => (
            <View style={{ marginHorizontal: theme.spacing[2] }} key={index}>
              <StatusCardSkeleton />
            </View>
          ))}
        <ApplicationsPreview
          headingTitleId="applications.incomplete"
          headingTitleNavigationLink="/more/applications/incomplete"
          applications={sortedApplications.incomplete}
        />
        <ApplicationsPreview
          headingTitleId="applications.inProgress"
          headingTitleNavigationLink="/more/applications/in-progress"
          applications={sortedApplications.inProgress}
        />
        <ApplicationsPreview
          headingTitleId="applications.completed"
          headingTitleNavigationLink="/more/applications/completed"
          applications={sortedApplications.completed}
          numberOfItems={3}
          slider
        />
      </Animated.ScrollView>
      <TopLine scrollY={scrollY} />
    </Host>
  )
}
