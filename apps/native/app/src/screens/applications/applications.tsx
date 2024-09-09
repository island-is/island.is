import {
  Badge,
  ChevronRight,
  EmptyList,
  Heading,
  StatusCard,
  Typography,
  ViewPager,
} from '@ui'
import { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { useTheme } from 'styled-components'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks'
import illustrationSrc from '../../assets/illustrations/le-jobs-s3.png'
import {
  Application,
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useBrowser } from '../../lib/use-browser'
import { getApplicationUrl } from '../../utils/applications-utils'
import { testIDs } from '../../utils/test-ids'
import { isIos } from '../../utils/devices'
import { navigateTo } from '../../lib/deep-linking'

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
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
        text: initialized
          ? intl.formatMessage({ id: 'applications.bottomTabText' })
          : '',
      },
    }),
    {
      topBar: {
        largeTitle: {
          visible: true,
        },
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
  finished: Application[]
}

export const sortApplicationsStatus = (
  applications: Application[],
): SortedApplication => {
  const incomplete: Application[] = []
  const inProgress: Application[] = []
  const finished: Application[] = []

  applications.forEach((application) => {
    if (
      application.state === ApplicationResponseDtoStatusEnum.Draft ||
      application.state === 'prerequisites'
    ) {
      incomplete.push(application)
    } else if (
      application.status === ApplicationResponseDtoStatusEnum.Inprogress
    ) {
      inProgress.push(application)
    } else {
      finished.push(application)
    }
  })

  return {
    incomplete,
    inProgress,
    finished,
  }
}

export const ApplicationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const { openBrowser } = useBrowser()
  const theme = useTheme()
  const [refetching, setRefetching] = useState(false)
  const intl = useIntl()
  const [hiddenContent, setHiddenContent] = useState(isIos)

  const applicationsRes = useListApplicationsQuery()
  const applications = useMemo(
    () => applicationsRes.data?.applicationApplications ?? [],
    [applicationsRes],
  )

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [applicationsRes],
  })

  const sortedApplications = useMemo(
    () => sortApplicationsStatus(applications),
    [applications],
  )

  useNavigationComponentDidAppear(() => {
    setHiddenContent(false)
  }, componentId)

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

  // Fix for a bug in react-native-navigation where the large title is not visible on iOS with bottom tabs https://github.com/wix/react-native-navigation/issues/6717
  if (hiddenContent) {
    return null
  }

  const getApplicationBadgeColors = (
    typeOfApplication: 'incomplete' | 'inProgress' | 'finished',
  ): { titleColor: string; type: 'green' | 'blue' | 'purple' } => {
    switch (typeOfApplication) {
      case 'finished':
        return { titleColor: theme.color.mint800, type: 'green' }
      case 'inProgress':
        return { titleColor: theme.color.blueberry400, type: 'purple' }
      case 'incomplete':
        return { titleColor: theme.color.blue400, type: 'blue' }
    }
  }

  const getApplications = (
    applications: Application[],
    numberOfItems: number,
    type: 'incomplete' | 'inProgress' | 'finished',
    style?: ViewStyle,
  ) => {
    return applications.slice(0, numberOfItems).map((application) => (
      <StatusCard
        key={application.id}
        title={application.name ?? ''}
        date={new Date(application.created)}
        badge={
          <Badge
            title={intl.formatMessage(
              { id: 'applicationStatusCard.status' },
              { state: application.status || 'unknown' },
            )}
            {...getApplicationBadgeColors(type)}
          />
        }
        progress={
          type !== 'incomplete' ? undefined : (application.progress ?? 0) * 100
        }
        description={
          type !== 'incomplete'
            ? intl.formatMessage(
                { id: 'applicationStatusCard.description' },
                { state: application.status || 'unknown' },
              )
            : undefined
        }
        actions={[
          {
            text: intl.formatMessage({
              id: 'applicationStatusCard.openButtonLabel',
            }),
            onPress() {
              openBrowser(getApplicationUrl(application), componentId)
            },
          },
        ]}
        institution={application.institution ?? ''}
        style={style}
      />
    ))
  }

  const incompleteApplications = getApplications(
    sortedApplications.incomplete,
    4,
    'incomplete',
  )

  const inProgressApplications = getApplications(
    sortedApplications.inProgress,
    4,
    'inProgress',
  )
  console.log(sortedApplications.inProgress[0])

  const styleForFinishedApplications =
    sortedApplications.finished.length > 1
      ? {
          width: 283,
          marginLeft: 16,
        }
      : {}

  const finishedApplications = getApplications(
    sortedApplications.finished,
    3,
    'finished',
    styleForFinishedApplications,
  )

  return (
    <SafeAreaView
      style={{
        marginHorizontal: theme.spacing[2],
        marginBottom: theme.spacing[2],
      }}
    >
      <ScrollView>
        {!applications.length ? (
          <View style={{ flex: 1 }}>
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
        {sortedApplications.incomplete.length > 0 ? (
          <TouchableOpacity
            disabled={sortedApplications.incomplete.length <= 4}
            onPress={() => navigateTo(`/applications-incomplete`)}
          >
            <Heading
              button={
                sortedApplications.incomplete.length > 4 ? (
                  <TouchableOpacity
                    onPress={() => navigateTo('/applications-incomplete')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="heading5" color={theme.color.blue400}>
                      {intl.formatMessage({ id: 'button.seeAll' })}
                    </Typography>
                    <ChevronRight />
                  </TouchableOpacity>
                ) : null
              }
            >
              {intl.formatMessage({ id: 'applications.unfinished' })}
            </Heading>
          </TouchableOpacity>
        ) : null}
        {incompleteApplications}
        {sortedApplications.inProgress.length > 0 ? (
          <TouchableOpacity
            disabled={sortedApplications.inProgress.length <= 4}
            onPress={() => navigateTo(`/applications-in-progress`)}
          >
            <Heading
              button={
                sortedApplications.inProgress.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => navigateTo('/applications-in-progress')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="heading5" color={theme.color.blue400}>
                      {intl.formatMessage({ id: 'button.seeAll' })}
                    </Typography>
                    <ChevronRight />
                  </TouchableOpacity>
                ) : null
              }
            >
              {intl.formatMessage({ id: 'applications.inProgress' })}
            </Heading>
          </TouchableOpacity>
        ) : null}
        {inProgressApplications}
        {sortedApplications.finished.length > 1 ? (
          <TouchableOpacity
            disabled={sortedApplications.finished.length === 1}
            onPress={() => navigateTo(`/applications-completed`)}
          >
            <Heading
              button={
                sortedApplications.finished.length > 1 ? (
                  <TouchableOpacity
                    onPress={() => navigateTo('/applications-completed')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="heading5" color={theme.color.blue400}>
                      {intl.formatMessage({ id: 'button.seeAll' })}
                    </Typography>
                    <ChevronRight />
                  </TouchableOpacity>
                ) : null
              }
            >
              {intl.formatMessage({ id: 'applications.finished' })}
            </Heading>
          </TouchableOpacity>
        ) : null}
        {sortedApplications.finished.length === 1 && finishedApplications}
        {sortedApplications.finished.length >= 2 && (
          <ViewPager>{finishedApplications}</ViewPager>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

ApplicationsScreen.options = getNavigationOptions
