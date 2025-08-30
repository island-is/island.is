import { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Image, RefreshControl, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import { EmptyList, StatusCardSkeleton } from '../../ui'
import illustrationSrc from '../../assets/illustrations/le-jobs-s3.png'
import {
  Application,
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { testIDs } from '../../utils/test-ids'
import { ApplicationsPreview } from './components/applications-preview'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'

const Host = styled.SafeAreaView`
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
      bottomTab: {
        iconColor: theme.color.blue400,
        text: intl.formatMessage({ id: 'applications.bottomTabText' }),
      },
    }),
    {
      topBar: {
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_APPLICATION,
        iconInsets: {
          bottom: -4,
        },
        icon: require('../../assets/icons/tabbar-applications.png'),
        selectedIcon: require('../../assets/icons/tabbar-applications-selected.png'),
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
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
      </ScrollView>
      <BottomTabsIndicator index={3} total={5} />
    </Host>
  )
}

ApplicationsScreen.options = getNavigationOptions
