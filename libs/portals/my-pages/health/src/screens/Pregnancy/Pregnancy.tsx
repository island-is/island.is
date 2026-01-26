import { Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  InfoCard,
  InfoCardGrid,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsOverviewQuery } from '../HealthOverview/HealthOverview.generated'

import DocumentDisplay from '../Communications/components/DocumentsDisplay/DocumentsDisplay'
import { useDocumentList } from '@island.is/portals/my-pages/documents'
const Pregnancy = () => {
  const { formatMessage } = useLocale()
  const [showAppointments, setShowAppointments] = useState(false)
  const { filteredDocuments, loading } = useDocumentList()

  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.isServicePortalHealthAppointmentsPageEnabled,
        false,
      )
      if (ffEnabled) {
        setShowAppointments(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    data: appointmentsData,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useGetAppointmentsOverviewQuery({
    variables: {
      status: DEFAULT_APPOINTMENTS_STATUS, // Empty will fetch all statuses
    },
    skip: !showAppointments,
  })

  const firstTwoAppointments =
    appointmentsData?.healthDirectorateAppointments?.data?.slice(0, 2) || []

  return (
    <IntroWrapper
      title={messages.myPregnancy}
      intro={messages.myPregnancyIntro}
      childrenWidthFull
      buttonGroup={[
        <Button
          variant="utility"
          size="small"
          key="button1"
          as="span"
          iconType="outline"
          icon="open"
        >
          <a
            href={formatMessage(messages.readingMaterialPregnancyLink)}
            target="_blank"
            rel="noreferrer"
          >
            {formatMessage(messages.readingMaterialPregnancy)}
          </a>
        </Button>,
      ]}
    >
      {/* My appointments - TODO: fetch only pregnancy related time appointments */}
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
      {/* Display documents for pregnancy - TODO: Fix and display only pregnancy related data */}
      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {formatMessage(m.myInfo)}
      </Text>
      <DocumentDisplay
        title={formatMessage(messages.communications)}
        icon="chatbubble"
        link={HealthPaths.HealthPregnancyCommunications}
        documents={filteredDocuments}
        loading={loading}
      />
      {/* Default shortcuts cards */}
      <InfoCardGrid
        empty={undefined} // TODO
        error={undefined} // TODO
        cards={[
          {
            id: 'pregnancy-questionnaire-card',
            title: formatMessage(messages.questionnaires),
            description: formatMessage(messages.changedLast, {
              arg: '12. mars 2024',
            }),
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-info-card',
            title: formatMessage(messages.labResults),
            description: formatMessage(messages.changedLast, {
              arg: '22. febrúar 2024',
            }),
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-info-card',
            title: formatMessage(messages.infoMaterial),
            description: formatMessage(messages.changedLast, {
              arg: '10. janúar 2024',
            }),
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-measurements-card',
            title: formatMessage(messages.measurements),
            description: formatMessage(messages.changedLast, {
              arg: '29. desember 2023',
            }),
            to: HealthPaths.HealthPregnancyMeasurements,
          },
        ]}
      />
      {/* Pregnancy details */}
      <InfoCard
        size="large"
        variant="detail"
        fontSize="medium"
        detail={[
          {
            label: formatMessage(messages.pregnancyLength),
            value: '19 vikur + 2 dagar',
          },
          {
            label: formatMessage(messages.dueDatePregnancy),
            value: '08.07.2026',
          },
          {
            label: formatMessage(messages.midwife),
            value: 'Sigríður Gunnardsóttir',
          },
          {
            label: formatMessage(messages.partner), // optional if registered, hide if not
            value: 'Sighvatur Guðbjartsson',
          },
        ]}
        img="./assets/images/baby.svg"
      />
    </IntroWrapper>
  )
}

export default Pregnancy
