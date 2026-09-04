import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  LinkResolver,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import { useGetAppointmentsOverviewQuery } from '../HealthOverview/HealthOverview.generated'
import Appointments from '../HealthOverview/components/Appointments'
import TreatmentLinkCard from './components/TreatmentLinkCard'
import TreatmentMessages from './components/TreatmentMessages'
import { useGetHealthTreatmentQuery } from './TreatmentOverview.generated'

type UseParams = {
  id: string
}

const TreatmentOverview = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetHealthTreatmentQuery({
    variables: { id },
  })

  const {
    data: appointmentsData,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useGetAppointmentsOverviewQuery({
    variables: {
      status: DEFAULT_APPOINTMENTS_STATUS,
    },
  })

  const treatment = data?.healthDirectorateTreatment

  const firstTwoAppointments =
    appointmentsData?.healthDirectorateAppointments?.data?.slice(0, 2) || []

  const linkCards = [
    {
      label: formatMessage(messages.questionnaires),
      to: HealthPaths.HealthQuestionnaires,
      lastSentAt: treatment?.lastQuestionnaireSentAt,
      lastSentMessage: messages.lastListSent,
    },
    {
      label: formatMessage(m.healthTreatmentEducationalContent),
      to: HealthPaths.HealthTreatmentEducationalContent.replace(':id', id),
      lastSentAt: treatment?.lastDocumentSentAt,
      lastSentMessage: messages.lastContentSent,
    },
  ]

  // Carries the treatment's provider node so the new-message screen can
  // preselect the recipient.
  const newMessageHref = treatment?.responsibleNode
    ? `${HealthPaths.HealthConversationsNew}?node=${encodeURIComponent(
        treatment.responsibleNode,
      )}`
    : HealthPaths.HealthConversationsNew

  const quickLinks = [
    ...(treatment?.supportsMessaging
      ? [
          {
            href: newMessageHref,
            label: formatMessage(messages.healthConversationSend),
          },
        ]
      : []),
    {
      href: HealthPaths.HealthQuestionnaires,
      label: formatMessage(messages.questionnaires),
    },
    {
      href: HealthPaths.HealthTreatmentEducationalContent.replace(':id', id),
      label: formatMessage(m.healthTreatmentEducationalContent),
    },
  ]

  return (
    <IntroWrapper
      title={treatment?.name ?? formatMessage(m.healthTreatment)}
      intro={
        treatment?.departmentName
          ? formatMessage(messages.treatmentIntroWithDepartment, {
              department: treatment.departmentName,
            })
          : formatMessage(messages.treatmentIntro)
      }
      serviceProvider={{
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirTreatmentTooltip),
      }}
      marginBottom={[0, 0, 0, 2]}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : loading ? (
        <CardLoader />
      ) : !treatment ? (
        <Problem type="no_data" noBorder={false} />
      ) : (
        <>
          <Box marginBottom={4}>
            <Inline space={1}>
              {quickLinks.map((link) => (
                <LinkResolver key={link.href} href={link.href}>
                  <Tag variant="blue">{link.label}</Tag>
                </LinkResolver>
              ))}
            </Inline>
          </Box>
          <Stack space={6}>
            {(treatment.recentConversations?.length ?? 0) > 0 && (
              <TreatmentMessages
                conversations={treatment.recentConversations ?? []}
                newMessageHref={
                  treatment.supportsMessaging ? newMessageHref : undefined
                }
              />
            )}

            <Box>
              <Text
                variant="eyebrow"
                color="purple400"
                fontWeight="semiBold"
                marginBottom={2}
              >
                {formatMessage(m.myInfo)}
              </Text>
              <GridRow rowGap={2}>
                {linkCards.map((card) => (
                  <GridColumn key={card.to} span={['12/12', '12/12', '6/12']}>
                    <TreatmentLinkCard
                      label={card.label}
                      to={card.to}
                      text={
                        card.lastSentAt
                          ? formatMessage(card.lastSentMessage, {
                              date: formatDate(card.lastSentAt),
                            })
                          : undefined
                      }
                    />
                  </GridColumn>
                ))}
              </GridRow>
            </Box>

            <Appointments
              data={{
                data: { data: firstTwoAppointments },
                loading: appointmentsLoading,
                error: !!appointmentsError,
              }}
              showLinkButton
            />
          </Stack>
        </>
      )}
    </IntroWrapper>
  )
}

export default TreatmentOverview
