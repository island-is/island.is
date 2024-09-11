import {
  Badge,
  ChevronRight,
  Heading,
  StatusCard,
  Typography,
  ViewPager,
} from '@ui'
import { useIntl } from 'react-intl'
import { TouchableOpacity, View } from 'react-native'
import { useTheme } from 'styled-components'
import { Application } from '../../../graphql/types/schema'
import { useBrowser } from '../../../lib/use-browser'
import { getApplicationUrl } from '../../../utils/applications-utils'
import { navigateTo } from '../../../lib/deep-linking'
import { screenWidth } from '../../../utils/dimensions'

interface ApplicationsPreviewProps {
  componentId: string
  applications: Application[]
  type: 'incomplete' | 'inProgress' | 'completed'
  numberOfItems?: number
  slider?: boolean
}

const applicationTypes = {
  incomplete: {
    link: 'applications-incomplete',
    titleId: 'applications.incomplete',
    badgeVariant: 'blue',
  },
  inProgress: {
    link: 'applications-in-progress',
    titleId: 'applications.inProgress',
    badgeVariant: 'blueberry',
  },
  completed: {
    link: 'applications-completed',
    titleId: 'applications.completed',
    badgeVariant: 'mint',
  },
} as const

export const ApplicationsPreview = ({
  componentId,
  type,
  applications,
  numberOfItems = 4,
  slider = false,
}: ApplicationsPreviewProps) => {
  const { openBrowser } = useBrowser()
  const theme = useTheme()
  const intl = useIntl()

  const count = applications.length

  const getApplications = (
    applications: Application[],
    numberOfItems: number,
    type: ApplicationsPreviewProps['type'],
  ) => {
    return applications.slice(0, numberOfItems).map((application) => (
      <StatusCard
        key={application.id}
        title={application.name ?? ''}
        date={new Date(application.created ?? new Date())}
        badge={
          <Badge
            title={intl.formatMessage(
              { id: 'applicationStatusCard.status' },
              { state: application.status || 'unknown' },
            )}
            variant={applicationTypes[type].badgeVariant}
          />
        }
        progress={
          type !== 'incomplete'
            ? undefined
            : application.actionCard?.draftFinishedSteps ?? 0
        }
        progressTotalSteps={application.actionCard?.draftTotalSteps ?? 0}
        progressMessage={intl.formatMessage(
          {
            id: 'applicationStatusCard.draftProgress',
          },
          {
            draftFinishedSteps: application.actionCard?.draftFinishedSteps,
            draftTotalSteps: application.actionCard?.draftTotalSteps,
          },
        )}
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
    ))
  }

  const items = getApplications(applications, numberOfItems, type)

  return (
    <>
      {applications.length > 0 ? (
        <TouchableOpacity
          disabled={applications.length <= 4}
          onPress={() => navigateTo(`${applicationTypes[type].link}`)}
          style={{ marginHorizontal: theme.spacing[2] }}
        >
          <Heading
            button={
              applications.length > 4 ? (
                <TouchableOpacity
                  onPress={() => navigateTo(`${applicationTypes[type].link}`)}
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
            {intl.formatMessage({ id: `${applicationTypes[type].titleId}` })}
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
