import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { aidAmount } from '../../../lib/messages'
import { waitingForSpouse } from '../../..'
import Breakdown from '../../../components/Breakdown/Breakdown'
import { Estimation } from '../Estimation/Estimation'
import { Application, DataProviderResult } from '@island.is/application/types'
import { VeitaEstimation } from '../Estimation/VeitaEstimation'
import {
  acceptedAmountBreakDown,
  Amount,
  ApplicationState,
  Application as FinancialAidAnswers,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  application: Application
  veitaApplication?: FinancialAidAnswers
  municipality: DataProviderResult
  state?: ApplicationState
  amount?: Amount
}

const AidAmount = ({
  application,
  state,
  municipality,
  amount,
  veitaApplication,
}: Props) => {
  const { formatMessage } = useIntl()

  if (!application && !veitaApplication) {
    return null
  }

  return (
    <Box marginBottom={[4, 4, 5]}>
      {state === ApplicationState.APPROVED ? (
        <>
          <Text as="h3" variant="h3" marginBottom={2}>
            {formatMessage(aidAmount.titleApproved)}
          </Text>
          <Breakdown calculations={acceptedAmountBreakDown(amount)} />
        </>
      ) : waitingForSpouse(application.state) ? (
        <Estimation application={application} municipality={municipality} />
      ) : veitaApplication ? (
        <VeitaEstimation
          application={veitaApplication}
          municipality={municipality}
        />
      ) : null}
    </Box>
  )
}

export default AidAmount
