import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  STAFRAEN_HEILSA_SLUG,
  IntroWrapper,
  LinkResolver,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { generatePath, useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import { useTreatmentScopedPaths } from '../../utils/useTreatmentScopedPaths'
import { useGetAppointmentsOverviewQuery } from '../HealthOverview/HealthOverview.generated'
import Appointments from '../HealthOverview/components/Appointments'
import TreatmentLinkCard from './components/TreatmentLinkCard'
import TreatmentMessages from './components/TreatmentMessages'
import { useGetHealthTreatmentQuery } from './TreatmentOverview.generated'

type UseParams = {
  treatmentId: string
}

const TreatmentOverview = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { treatmentId } = useParams() as UseParams

  const { data, loading, error } = useGetHealthTreatmentQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id: treatmentId },
  })

  const initialLoading = loading && !data

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

  const paths = useTreatmentScopedPaths()
  const educationalContentPath = generatePath(
    HealthPaths.HealthTreatmentEducationalContent,
    { treatmentId },
  )

  const linkCards = [
    {
      label: formatMessage(messages.questionnaires),
      to: paths.questionnaires,
      lastSentAt: treatment?.lastQuestionnaireSentAt,
    },
    {
      label: formatMessage(m.healthTreatmentEducationalContent),
      to: educationalContentPath,
      lastSentAt: treatment?.lastDocumentSentAt,
    },
  ]

  const quickLinks = [
    ...(treatment?.supportsMessaging
      ? [
          {
            href: paths.conversations,
            label: formatMessage(m.messages),
          },
        ]
      : []),
    {
      href: paths.questionnaires,
      label: formatMessage(messages.questionnaires),
    },
    {
      href: educationalContentPath,
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
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaTreatmentTooltip),
      }}
      marginBottom={[0, 0, 0, 2]}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : initialLoading ? (
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
                        ? formatMessage(messages.lastSent, {
                            date: formatDate(card.lastSentAt),
                          })
                        : undefined
                    }
                  />
                </GridColumn>
              ))}
            </GridRow>
          </Box>

          {(treatment.recentConversations?.length ?? 0) > 0 && (
            <Box marginTop={[3, 3, 6]}>
              <TreatmentMessages
                conversations={treatment.recentConversations ?? []}
                newMessageHref={
                  treatment.supportsMessaging
                    ? paths.conversationsNew
                    : undefined
                }
              />
            </Box>
          )}

          <Box marginTop={6}>
            <Appointments
              data={{
                data: { data: firstTwoAppointments },
                loading: appointmentsLoading,
                error: !!appointmentsError,
              }}
              showLinkButton
            />
          </Box>
        </>
      )}
    </IntroWrapper>
  )
}

export default TreatmentOverview
