import { Box, Icon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoCard,
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
import ConversationAvatar from '../HealthConversations/components/ConversationAvatar'

// TODO: mock data below stands in for /pregnancies/{id}/communications until that query exists
const mockPregnancyMessages = [
  {
    id: 'mock-1',
    organization: 'Mæðravernd',
    title: 'Spurningarlistar og fræðsla',
    date: 'Í dag',
  },
  {
    id: 'mock-2',
    organization: 'Mæðravernd',
    title: 'Grunur um legvatnsleka',
    date: '27.06.2026',
  },
  {
    id: 'mock-3',
    organization: 'Mæðravernd',
    title: 'Stingur og mögulega lekur legvatn',
    date: '26.06.2026',
  },
]

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
          title={messages.nextAppointments}
        />
      )}

      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {formatMessage(m.myInfo)}
      </Text>

      {/* TODO: mock data — replace with /pregnancies/{id}/communications once it exists */}
      <Box
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={3}
        marginBottom={3}
      >
        <Box display="flex" alignItems="center" columnGap={1} marginBottom={2}>
          <Icon icon="chatbubble" color="blue400" type="outline" />
          <Text variant="h4" color="blue400">
            {formatMessage(messages.pregnancyMessagesTitle)}
          </Text>
        </Box>
        <Stack space={0}>
          {mockPregnancyMessages.map((item) => (
            <Box
              key={item.id}
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
              borderColor="blue200"
              borderTopWidth="standard"
              paddingY={2}
              columnGap={2}
            >
              <Box
                display="flex"
                alignItems="center"
                columnGap={2}
                minWidth={0}
              >
                <ConversationAvatar variant="organization" />
                <Box minWidth={0}>
                  <Text variant="medium">{item.organization}</Text>
                  <Text color="blue400" truncate>
                    {item.title}
                  </Text>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                columnGap={2}
                style={{ flexShrink: 0 }}
              >
                <Text variant="medium">{item.date}</Text>
                <Icon icon="download" color="blue400" type="outline" />
                <Icon icon="star" color="blue400" type="outline" />
              </Box>
            </Box>
          ))}
        </Stack>
        <Box display="flex" justifyContent="center" marginTop={2}>
          <LinkButton
            to={HealthPaths.HealthConversations}
            text={formatMessage(messages.seeAllMessages)}
            variant="text"
            size="small"
          />
        </Box>
      </Box>

      <InfoCardGrid
        cards={[
          {
            id: 'pregnancy-questionnaire-card',
            title: formatMessage(messages.questionnaires),
            description: formatMessage(messages.changedLast, {
              arg: '05.11.2024',
            }),
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-documents-card',
            title: formatMessage(messages.pregnancyDocumentsCard),
            description: formatMessage(messages.changedLast, {
              arg: '05.11.2024',
            }),
            // TODO: point at the real Skjöl screen once it's built
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-info-material-card',
            title: formatMessage(messages.infoMaterial),
            // TODO: point at the real Fræðsluefni screen once it's built
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-measurements-card',
            title: formatMessage(messages.measurements),
            description: formatMessage(messages.changedLast, {
              arg: '05.11.2024',
            }),
            // TODO: point at the real Mælingar screen once it's built
            to: HealthPaths.HealthQuestionnaires,
          },
        ]}
      />

      {/* TODO: mock data — replace with GET /pregnancies/active once it exists */}
      <InfoCard
        title={formatMessage(messages.pregnancy)}
        size="large"
        variant="detail"
        detail={[
          {
            label: formatMessage(messages.pregnancyLength),
            value: '19 vikur + 2 dagar',
          },
          {
            label: formatMessage(messages.dueDatePregnancy),
            value: '08.07.2025',
          },
          {
            label: formatMessage(messages.midwife),
            value: 'Sigríður Gunnarsdóttir',
          },
          {
            label: formatMessage(messages.partner),
            value: 'Guðlaugur Þórarinsson',
          },
        ]}
        img="./assets/images/baby.svg"
      />
    </IntroWrapper>
  )
}

export default Pregnancy
