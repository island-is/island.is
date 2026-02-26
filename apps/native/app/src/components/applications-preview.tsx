import React from 'react'
import { useIntl } from 'react-intl'
import { TouchableOpacity, View } from 'react-native'
import { useTheme } from 'styled-components'

import {
  Badge,
  badgeColorSchemes,
  ChevronRight,
  Heading,
  StatusCard,
  Typography,
  ViewPager,
} from '@/ui'
import { Application } from '@/graphql/types/schema'
import { getApplicationType } from '../utils/applications/get-application-type'
import { getBadgeVariant } from '../utils/applications/get-badge-variant'
import { useBrowser } from '@/hooks/use-browser'
import { getApplicationUrl } from '@/utils/applications-utils'
import { Href, useRouter } from 'expo-router'
import { screenWidth } from '@/utils/dimensions'

interface ApplicationsPreviewProps {
  applications: Application[]
  headingTitleId: string
  headingTitleNavigationLink: Href
  numberOfItems?: number
  slider?: boolean
}

export const ApplicationsPreview = ({
  headingTitleId,
  headingTitleNavigationLink,
  applications,
  numberOfItems = 4,
  slider = false,
}: ApplicationsPreviewProps) => {
  const { openBrowser } = useBrowser()
  const router = useRouter()
  const theme = useTheme()
  const intl = useIntl()

  const count = applications.length

  const getApplications = (
    applications: Application[],
    numberOfItems: number,
  ) => {
    return applications.slice(0, numberOfItems).map((application) => {
      const type = getApplicationType(application)
      const badgeVariant =
        application?.actionCard?.tag?.variant ?? getBadgeVariant(application)

      return (
        <StatusCard
          key={application.id}
          title={application.name ?? ''}
          date={
            application.created ? new Date(application.created) : new Date()
          }
          badge={
            <Badge
              title={intl.formatMessage(
                { id: 'applicationStatusCard.status' },
                { state: application.status || 'unknown' },
              )}
              variant={badgeVariant as keyof typeof badgeColorSchemes}
            />
          }
          progress={
            type === 'incomplete'
              ? application.actionCard?.draftFinishedSteps ?? 0
              : undefined
          }
          progressTotalSteps={
            type === 'incomplete'
              ? application.actionCard?.draftTotalSteps ?? 0
              : undefined
          }
          progressMessage={intl.formatMessage(
            {
              id: 'applicationStatusCard.draftProgress',
            },
            {
              draftFinishedSteps: application.actionCard?.draftFinishedSteps,
              draftTotalSteps: application.actionCard?.draftTotalSteps,
            },
          )}
          progressContainerWidth={
            slider && count > 1 ? screenWidth - theme.spacing[2] * 6 : undefined
          }
          description={
            type !== 'incomplete'
              ? application.actionCard?.pendingAction?.title ??
                intl.formatMessage(
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
                openBrowser(getApplicationUrl(application))
              },
            },
          ]}
          institution={application.institution ?? ''}
          style={
            slider && count > 1
              ? {
                  width: screenWidth - theme.spacing[2] * 4,
                  marginLeft: theme.spacing[2],
                }
              : {
                  marginHorizontal: theme.spacing[2],
                }
          }
        />
      )
    })
  }

  const items = getApplications(applications, numberOfItems)

  return (
    <>
      {applications.length > 0 ? (
        <TouchableOpacity
          disabled={applications.length <= numberOfItems}
          onPress={() => router.navigate(headingTitleNavigationLink)}
          style={{ marginHorizontal: theme.spacing[2] }}
        >
          <Heading
            button={
              applications.length > numberOfItems ? (
                <TouchableOpacity
                  onPress={() => router.navigate(headingTitleNavigationLink)}
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
            {intl.formatMessage({ id: `${headingTitleId}` })}
          </Heading>
        </TouchableOpacity>
      ) : null}
      {!slider || count === 1 ? (
        items
      ) : (
        <View style={{ marginHorizontal: theme.spacing[2] }}>
          <ViewPager>{items}</ViewPager>
        </View>
      )}
    </>
  )
}
