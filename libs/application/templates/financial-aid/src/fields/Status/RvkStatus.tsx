import React from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { getNextPeriod } from '@island.is/financial-aid/shared/lib'
import { getValueViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

import { FAFieldBaseProps } from '../../lib/types'
import { isSubmittedToMunicipality, waitingForSpouse } from '../../lib/utils'
import { rvkStatus } from '../../lib/messages'
import DescriptionText from '../DescriptionText/DescriptionText'
import { Estimation, MoreActions, SpouseAlert } from './index'
import * as styles from './Status.css'

// Status screen for municipalities that handle processing outside of island.is,
// so there is no case state, timeline or caseworker messages to show.
const RvkStatus = ({ application, field }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const { municipality } = application.externalData

  const isSpouse = Boolean(
    getValueViaPath(field as unknown as RecordObject, 'props.isSpouse'),
  )

  const isWaitingForSpouse = !isSpouse && waitingForSpouse(application.state)

  const isSubmitted = isSubmittedToMunicipality(application.state)

  // Applicants with an active application skip the draft, so there are no
  // answers to estimate from.
  const canEstimateAid = Boolean(
    application.answers?.homeCircumstances?.type && municipality.data,
  )

  return (
    <Box paddingBottom={5} className={styles.container}>
      {isSubmitted && (
        <Box marginBottom={[4, 4, 5]}>
          <AlertMessage
            type="success"
            title={formatMessage(
              isSpouse ? rvkStatus.spouseAlertTitle : rvkStatus.alertTitle,
            )}
          />
        </Box>
      )}

      {isWaitingForSpouse && (
        <SpouseAlert
          showCopyUrl={!application.externalData.sendSpouseEmail?.data.success}
        />
      )}

      {!isSpouse && canEstimateAid && (
        <Box marginBottom={[4, 4, 5]}>
          <Estimation application={application} municipality={municipality} />
        </Box>
      )}

      {isSubmitted && (
        <Box marginBottom={[4, 4, 5]}>
          <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
            {formatMessage(rvkStatus.nextStepsTitle)}
          </Text>
          <DescriptionText
            text={rvkStatus.nextSteps}
            format={{ nextMonth: getNextPeriod(lang).month }}
          />
        </Box>
      )}

      <MoreActions
        municipalityRulesPage={municipality.data?.rulesHomepage}
        municipalityEmail={municipality.data?.email}
      />
    </Box>
  )
}

export default RvkStatus
