import { Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoCardGrid,
  IntroWrapper,
  LinkButton,
  m,
} from '@island.is/portals/my-pages/core'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsOverviewQuery } from '../HealthOverview/HealthOverview.generated'

const Pregnancy = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { value: showAppointments } = useFeatureFlag(
    Features.isServicePortalHealthAppointmentsPageEnabled,
    false,
  )

  const {
    data: appointmentsData,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useGetAppointmentsOverviewQuery({
    variables: {
      status: DEFAULT_APPOINTMENTS_STATUS,
    },
    skip: !showAppointments,
  })

  const firstTwoAppointments =
    appointmentsData?.healthDirectorateAppointments?.data?.slice(0, 2) || []

  return (
    <IntroWrapper
      title={messages.myPregnancy}
      intro={messages.myPregnancyIntro}
      buttonGroup={{
        actions: [
          <LinkButton
            key="reading-material-pregnancy"
            to={formatMessage(messages.readingMaterialPregnancyLink)}
            text={formatMessage(messages.readingMaterialPregnancy)}
            variant="utility"
            icon="open"
          />,
        ],
      }}
    >
      {showAppointments && (
        <Appointments
          data={{
            data: { data: firstTwoAppointments },
            loading: appointmentsLoading,
            error: !!appointmentsError,
          }}
          showLinkButton
        />
      )}

      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {formatMessage(m.myInfo)}
      </Text>

      <InfoCardGrid
        cards={[
          {
            id: 'pregnancy-questionnaire-card',
            title: formatMessage(messages.questionnaires),
            to: HealthPaths.HealthQuestionnaires,
          },
        ]}
      />
    </IntroWrapper>
  )
}

export default Pregnancy
