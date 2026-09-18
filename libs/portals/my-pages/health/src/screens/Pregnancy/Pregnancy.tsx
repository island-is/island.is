import { Box, Icon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  InfoCard,
  InfoCardGrid,
  IntroWrapper,
  LinkButton,
  m,
  STAFRAEN_HEILSA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsOverviewQuery } from '../HealthOverview/HealthOverview.generated'
import {
  useGetActivePregnancyQuery,
  useGetPregnancyCommunicationsPreviewQuery,
} from './Pregnancy.generated'

const MAX_COMMUNICATIONS_PREVIEW = 3

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

  const {
    data: pregnancyData,
    loading: pregnancyLoading,
    error: pregnancyError,
  } = useGetActivePregnancyQuery()

  const pregnancy = pregnancyData?.healthDirectorateActivePregnancy
  const pregnancyId = pregnancy?.id

  const { data: communicationsData, loading: communicationsLoading } =
    useGetPregnancyCommunicationsPreviewQuery({
      variables: { pregnancyId: pregnancyId ?? '' },
      skip: !pregnancyId,
    })

  const communicationsPreview = (
    communicationsData?.healthDirectoratePregnancyCommunications ?? []
  ).slice(0, MAX_COMMUNICATIONS_PREVIEW)

  const staffWithProfession = (pregnancy?.staff ?? []).filter(
    (staffMember) => staffMember.profession,
  )

  const initialLoading = pregnancyLoading && !pregnancyData

  return (
    <IntroWrapper
      title={messages.myPregnancy}
      intro={messages.myPregnancyIntro}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaPregnancyTooltip),
      }}
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

      {pregnancyError && !pregnancyLoading ? (
        <Problem error={pregnancyError} noBorder={false} />
      ) : initialLoading ? (
        <CardLoader />
      ) : (
        <>
          <Text variant="eyebrow" color="purple400" marginBottom={2}>
            {formatMessage(m.myInfo)}
          </Text>

          {(communicationsLoading || communicationsPreview.length > 0) && (
            <Box
              border="standard"
              borderColor="blue200"
              borderRadius="large"
              padding={3}
              marginBottom={3}
            >
              <Box
                display="flex"
                alignItems="center"
                columnGap={1}
                marginBottom={2}
              >
                <Icon icon="chatbubble" color="blue400" type="outline" />
                <Text variant="h4" color="blue400">
                  {formatMessage(messages.pregnancyMessagesTitle)}
                </Text>
              </Box>
              {communicationsLoading ? (
                <CardLoader />
              ) : (
                <Stack space={0}>
                  {communicationsPreview.map((item) => (
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
                      <Box minWidth={0}>
                        <Text variant="medium">
                          {item.authorName ??
                            formatMessage(messages.pregnancyMessagesTitle)}
                        </Text>
                        <Text color="blue400" truncate>
                          {item.subjectTerm ?? item.text}
                        </Text>
                      </Box>
                      {item.dateTime && (
                        <Box flexShrink={0}>
                          <Text variant="medium">
                            {formatDate(item.dateTime)}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
              <Box display="flex" justifyContent="center" marginTop={2}>
                <LinkButton
                  to={HealthPaths.HealthPregnancyCommunications}
                  text={formatMessage(messages.seeAllMessages)}
                  variant="text"
                  size="small"
                />
              </Box>
            </Box>
          )}

          <InfoCardGrid
            cards={[
              {
                id: 'pregnancy-questionnaire-card',
                title: formatMessage(messages.questionnaires),
                to: HealthPaths.HealthQuestionnaires,
              },
              {
                id: 'pregnancy-measurements-and-documents-card',
                title: formatMessage(
                  messages.pregnancyMeasurementsAndDocumentsCard,
                ),
                to: HealthPaths.HealthPregnancyMeasurementsAndDocuments,
              },
            ]}
          />

          {pregnancy && (
            <InfoCard
              title={formatMessage(messages.pregnancy)}
              size="large"
              variant="detail"
              detail={[
                ...(pregnancy.lengthWeeks != null
                  ? [
                      {
                        label: formatMessage(messages.pregnancyLength),
                        value:
                          pregnancy.lengthDays != null
                            ? formatMessage(
                                messages.pregnancyLengthWeeksAndDays,
                                {
                                  weeks: pregnancy.lengthWeeks,
                                  days: pregnancy.lengthDays,
                                },
                              )
                            : formatMessage(messages.pregnancyLengthWeeks, {
                                weeks: pregnancy.lengthWeeks,
                              }),
                      },
                    ]
                  : []),
                ...(pregnancy.dueDate
                  ? [
                      {
                        label: formatMessage(messages.dueDatePregnancy),
                        value: formatDate(pregnancy.dueDate),
                      },
                    ]
                  : []),
                ...staffWithProfession.map((staffMember) => ({
                  label: staffMember.profession as string,
                  value: staffMember.name,
                })),
                ...(pregnancy.partnerName
                  ? [
                      {
                        label: formatMessage(messages.partner),
                        value: pregnancy.partnerName,
                      },
                    ]
                  : []),
              ]}
              img="./assets/images/baby.svg"
            />
          )}
        </>
      )}
    </IntroWrapper>
  )
}

export default Pregnancy
