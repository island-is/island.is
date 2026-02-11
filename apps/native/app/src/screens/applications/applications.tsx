import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Animated, Image, RefreshControl, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import illustrationSrc from '../../assets/illustrations/le-jobs-s3.png'
import {
  Application,
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { EmptyList, StatusCardSkeleton, TopLine } from '../../ui'
import { ApplicationsPreview } from './components/applications-preview'

const Host = styled.View`
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'applications.title' }),
        },
        searchBar: {
          visible: false,
        },
      },
    }),
    {
      topBar: {
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
    },
  )

interface SortedApplication {
  incomplete: Application[]
  inProgress: Application[]
  completed: Application[]
}

export const sortApplicationsStatus = (
  applications: Application[],
): SortedApplication => {
  const incomplete: Application[] = []
  const inProgress: Application[] = []
  const completed: Application[] = []

  applications.forEach((application) => {
    if (
      application.status === ApplicationResponseDtoStatusEnum.Draft ||
      application.status === ApplicationResponseDtoStatusEnum.Notstarted
    ) {
      incomplete.push(application)
    } else if (
      application.status === ApplicationResponseDtoStatusEnum.Inprogress
    ) {
      inProgress.push(application)
    } else {
      completed.push(application)
    }
  })

  return {
    incomplete,
    inProgress,
    completed,
  }
}

export const ApplicationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
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

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: applicationsRes,
  })

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
          componentId={componentId}
          headingTitleId="applications.incomplete"
          headingTitleNavigationLink="/applications-incomplete"
          applications={sortedApplications.incomplete}
        />
        <ApplicationsPreview
          componentId={componentId}
          headingTitleId="applications.inProgress"
          headingTitleNavigationLink="/applications-in-progress"
          applications={sortedApplications.inProgress}
        />
        <ApplicationsPreview
          componentId={componentId}
          headingTitleId="applications.completed"
          headingTitleNavigationLink="/applications-completed"
          applications={sortedApplications.completed}
          numberOfItems={3}
          slider
        />
      </Animated.ScrollView>
      <TopLine scrollY={scrollY} />
    </Host>
  )
}

ApplicationsScreen.options = getNavigationOptions
