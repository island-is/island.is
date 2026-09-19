import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  InfoCardGrid,
  IntroWrapper,
  LinkButton,
  LinkResolver,
  m,
  STAFRAEN_HEILSA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import Appointments from '../HealthOverview/components/Appointments'
import * as conversationStyles from '../HealthOverview/components/HealthConversationsBox/HealthConversationsBox.css'
import * as listStyles from '../HealthConversations/HealthConversations.css'
import { useGetAppointmentsOverviewQuery } from '../HealthOverview/HealthOverview.generated'
import {
  useGetActivePregnancyQuery,
  useGetPregnancyCommunicationsPreviewQuery,
} from './Pregnancy.generated'
import PregnancyDetailCard from './PregnancyDetailCard'
import { formatSubjectTerm } from './utils'

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

  const midwives = (pregnancy?.staff ?? []).filter(
    (staffMember) =>
      staffMember.profession?.toLocaleLowerCase() === 'ljósmóðir',
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
              background="white"
              border="standard"
              borderColor="blue200"
              borderRadius="large"
              paddingY={3}
              marginBottom={3}
            >
              <Box
                display="flex"
                alignItems="center"
                columnGap={2}
                marginBottom={3}
                paddingX={3}
              >
                <Icon
                  icon="chatbubble"
                  type="outline"
                  color="blue400"
                  size="medium"
                />
                <Text variant="h4" as="h2" color="blue400">
                  {formatMessage(messages.pregnancyCommunicationsTitle)}
                </Text>
              </Box>
              {communicationsLoading ? (
                <Box paddingX={3}>
                  <CardLoader />
                </Box>
              ) : (
                communicationsPreview.map((item) => {
                  const kindLabel = formatMessage(
                    item.kind === 'PHONE_CALL'
                      ? messages.pregnancyCommunicationPhoneCall
                      : messages.pregnancyCommunicationExamination,
                  )
                  const subject = item.subjectTerm
                    ? formatSubjectTerm(item.subjectTerm)
                    : item.text
                  return (
                    <LinkResolver
                      key={item.id}
                      href={HealthPaths.HealthPregnancyCommunicationDetail.replace(
                        ':id',
                        item.id,
                      )}
                      className={conversationStyles.conversationLink}
                    >
                      <Box paddingX={[0, 0, 3]}>
                        <Box
                          display="flex"
                          justifyContent="spaceBetween"
                          alignItems="flexStart"
                          columnGap={2}
                          paddingY={2}
                          paddingX={[3, 3, 2]}
                          borderTopWidth="standard"
                          borderColor="blue200"
                          className={listStyles.conversationRow}
                        >
                          <Box overflow="hidden">
                            {item.authorName && (
                              <Text variant="medium" marginBottom="smallGutter">
                                {item.authorName}
                              </Text>
                            )}
                            <Text color="blue400" truncate>
                              {kindLabel}
                              {subject ? `: ${subject}` : ''}
                            </Text>
                          </Box>
                          {item.dateTime && (
                            <Text variant="medium" whiteSpace="nowrap">
                              {formatDate(item.dateTime)}
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </LinkResolver>
                  )
                })
              )}
              <Box paddingX={[0, 0, 3]}>
                <Box
                  display="flex"
                  justifyContent="center"
                  paddingTop={3}
                  borderTopWidth="standard"
                  borderColor="blue200"
                >
                  <LinkButton
                    to={HealthPaths.HealthPregnancyCommunications}
                    text={formatMessage(messages.seeAllCommunications)}
                    variant="text"
                    size="small"
                    icon="arrowForward"
                  />
                </Box>
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
            <PregnancyDetailCard
              details={[
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
                ...midwives.map((staffMember) => ({
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
