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
import {
  Application,
  ApplicationResponseDtoStatusEnum,
} from '../../../graphql/types/schema'
import { useBrowser } from '../../../lib/use-browser'
import { getApplicationUrl } from '../../../utils/applications-utils'
import { navigateTo } from '../../../lib/deep-linking'
import { screenWidth } from '../../../utils/dimensions'

interface ApplicationsPreviewProps {
  componentId: string
  applications: Application[]
  headingTitleId: string
  headingTitleNavigationLink: string
  numberOfItems?: number
  slider?: boolean
}

const getTypeAndBadgeVariant = (
  application: Application,
): {
  badgeVariant: 'blue' | 'mint' | 'blueberry'
  type: 'incomplete' | 'completed' | 'inProgress'
} => {
  switch (application.status) {
    case ApplicationResponseDtoStatusEnum.Draft:
      return { badgeVariant: 'blue', type: 'incomplete' }
    case ApplicationResponseDtoStatusEnum.Completed:
      return { badgeVariant: 'mint', type: 'completed' }
    case ApplicationResponseDtoStatusEnum.Inprogress:
      return { badgeVariant: 'blueberry', type: 'inProgress' }
    default:
      return { badgeVariant: 'blue', type: 'incomplete' }
  }
}

export const ApplicationsPreview = ({
  componentId,
  headingTitleId,
  headingTitleNavigationLink,
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
  ) => {
    return applications.slice(0, numberOfItems).map((application) => {
      const type = getTypeAndBadgeVariant(application).type

      return (
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
              variant={getTypeAndBadgeVariant(application).badgeVariant}
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
          progressContainerWidth={
            slider ? screenWidth - theme.spacing[2] * 6 : undefined
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
          disabled={
            (slider && !applications.length) ||
            (!slider && applications.length <= numberOfItems)
          }
          onPress={() => navigateTo(`${headingTitleNavigationLink}`)}
          style={{ marginHorizontal: theme.spacing[2] }}
        >
          <Heading
            button={
              (slider && applications.length) ||
              (!slider && applications.length > numberOfItems) ? (
                <TouchableOpacity
                  onPress={() => navigateTo(`${headingTitleNavigationLink}`)}
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
