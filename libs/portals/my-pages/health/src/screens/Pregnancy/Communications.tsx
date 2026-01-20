import { Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroWrapper, m } from '@island.is/portals/my-pages/core'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsOverviewQuery } from '../HealthOverview/HealthOverview.generated'

import DocumentDisplay from '../Communications/components/DocumentsDisplay/DocumentsDisplay'
const Communications = () => {
  const { formatMessage } = useLocale()
  const [showAppointments, setShowAppointments] = useState(false)

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
      {/* My appointments - fetch only pregnancy related time appointments */}
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
      {/* Display documents for pregnancy -> Fix and display only pregnancy related data */}
      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {formatMessage(m.myInfo)}
      </Text>
      <DocumentDisplay />
    </IntroWrapper>
  )
}

export default Communications
