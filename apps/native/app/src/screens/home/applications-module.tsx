import {
  Badge,
  ChevronRight,
  EmptyCard,
  Heading,
  LinkText,
  StatusCard,
  StatusCardSkeleton,
  Typography,
  ViewPager,
  blue400,
} from '@ui'
import React from 'react'
import { useIntl } from 'react-intl'
import { Image, SafeAreaView, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components'
import { ApolloError } from '@apollo/client'

import leJobss3 from '../../assets/illustrations/le-jobs-s3.png'
import {
  ListApplicationsQuery,
  useListApplicationsQuery,
} from '../../graphql/types/schema'
import { navigateTo } from '../../lib/deep-linking'
import { useBrowser } from '../../lib/use-browser'
import { getApplicationUrl } from '../../utils/applications-utils'
import { screenWidth } from '../../utils/dimensions'

interface ApplicationsModuleProps {
  data: ListApplicationsQuery | undefined
  loading: boolean
  error?: ApolloError | undefined
  componentId: string
  hideAction?: boolean
  hideSeeAllButton?: boolean
}

const validateApplicationsInitialData = ({
  data,
  loading,
}: {
  data: ListApplicationsQuery | undefined
  loading: boolean
}) => {
  if (loading) {
    return true
  }
  // Only show widget initially if there are applications
  if (data?.applicationApplications?.length !== 0) {
    return true
  }
  return false
}

const ApplicationsModule = React.memo(
  ({
    data,
    loading,
    error,
    componentId,
    hideAction,
    hideSeeAllButton = false,
  }: ApplicationsModuleProps) => {
    const intl = useIntl()
    const theme = useTheme()
    const applications = data?.applicationApplications ?? []
    const count = applications.length
    const { openBrowser } = useBrowser()

    if (error && !data) {
      return null
    }

    const items = applications.slice(0, 3).map((application) => (
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
          />
        }
        progress={(application.progress ?? 0) * 100}
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
        style={
          count > 1
            ? {
                width: screenWidth - theme.spacing[2] * 4,
                marginLeft: 16,
              }
            : {}
        }
      />
    ))

    return (
      <SafeAreaView
        style={{
          marginHorizontal: theme.spacing[2],
        }}
      >
        <TouchableOpacity
          disabled={count === 0}
          onPress={() => navigateTo(`/applications`)}
        >
          <Heading
            button={
              count === 0 || hideSeeAllButton ? null : (
                <TouchableOpacity
                  onPress={() => navigateTo('/applications')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="heading5" color={blue400}>
                    {intl.formatMessage({ id: 'button.seeAll' })}
                  </Typography>
                  <ChevronRight />
                </TouchableOpacity>
              )
            }
          >
            {intl.formatMessage({ id: 'home.applicationsStatus' })}
          </Heading>
        </TouchableOpacity>
        {loading && !data ? (
          <StatusCardSkeleton />
        ) : (
          <>
            {count === 0 && (
              <EmptyCard
                text={intl.formatMessage({
                  id: 'applicationStatusCard.noActiveApplications',
                })}
                image={
                  <Image
                    source={leJobss3}
                    resizeMode="contain"
                    style={{ height: 87, width: 69 }}
                  />
                }
                link={
                  hideAction ? null : (
                    <TouchableOpacity
                      onPress={() => navigateTo(`/applications`)}
                    >
                      <LinkText variant="small">
                        {intl.formatMessage({
                          id: 'applicationStatusCard.seeMoreApplications',
                        })}
                      </LinkText>
                    </TouchableOpacity>
                  )
                }
              />
            )}
            {count === 1 && items}
            {count >= 2 && <ViewPager>{items}</ViewPager>}
          </>
        )}
      </SafeAreaView>
    )
  },
)

export {
  ApplicationsModule,
  useListApplicationsQuery,
  validateApplicationsInitialData,
}
