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
import leJobss3 from '../../assets/illustrations/le-jobs-s3.png'
import { Application } from '../../graphql/types/schema'
import { navigateTo } from '../../lib/deep-linking'
import { useBrowser } from '../../lib/useBrowser'
import { getApplicationUrl } from '../../utils/applications-utils'

interface ApplicationsModuleProps {
  applications: Application[]
  loading: boolean
  componentId: string
  hideAction?: boolean
  hideSeeAllButton?: boolean
}

export const ApplicationsModule = React.memo(
  ({
    applications,
    loading,
    componentId,
    hideAction,
    hideSeeAllButton = false,
  }: ApplicationsModuleProps) => {
    const intl = useIntl()
    const count = applications.length
    const { openBrowser } = useBrowser()

    const children = applications.slice(0, 5).map((application) => (
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
                width: 283,
                marginLeft: 16,
              }
            : {}
        }
      />
    ))

    return (
      <SafeAreaView style={{ marginHorizontal: 16 }}>
        <TouchableOpacity onPress={() => navigateTo(`/applications`)}>
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
                  <Typography weight="400" color={blue400}>
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
        {loading ? (
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
            {count === 1 && children.slice(0, 1)}
            {count >= 2 && <ViewPager>{children}</ViewPager>}
          </>
        )}
      </SafeAreaView>
    )
  },
)
