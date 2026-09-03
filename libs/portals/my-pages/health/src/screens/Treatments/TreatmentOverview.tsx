import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
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

  // Same unfiltered appointments as the health overview page.
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
    },
    {
      label: formatMessage(messages.educationalContent),
      to: HealthPaths.HealthTreatmentEducationalContent.replace(':id', id),
      lastSentAt: treatment?.lastDocumentSentAt,
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
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : loading ? (
        <CardLoader />
      ) : !treatment ? (
        <Problem type="no_data" noBorder={false} />
      ) : (
        <Stack space={2}>
          <Appointments
            data={{
              data: { data: firstTwoAppointments },
              loading: appointmentsLoading,
              error: !!appointmentsError,
            }}
            showLinkButton
          />

          <Box>
            <Text
              variant="eyebrow"
              color="purple400"
              fontWeight="semiBold"
              marginBottom={2}
            >
              {formatMessage(m.myInfo)}
            </Text>
            <TreatmentMessages
              conversations={treatment.recentConversations ?? []}
            />
          </Box>

          <GridRow rowGap={2} marginTop={1}>
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
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default TreatmentOverview
