import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  Amount,
  acceptedAmountBreakDown,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

import { Breakdown } from '../..'
import { status } from '../../../lib/messages'
import Estimation from '../Estimation/Estimation'
import { FAApplication } from '../../../lib/types'

interface Props {
  application: FAApplication
  state: ApplicationState
}

const AidAmount = ({ application, state }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      {state === ApplicationState.APPROVED ? (
        <>
          <Text as="h3" variant="h3" marginBottom={2}>
            {formatMessage(status.aidAmount.titleApproved)}
          </Text>
          <Breakdown
            calculations={acceptedAmountBreakDown({
              aidAmount: 10000,
              personalTaxCredit: 2000,
              tax: 1000,
              finalAmount: 20000,
            })}
          />
        </>
      ) : (
        <Estimation application={application} />
      )}
    </Box>
  )
}

export default AidAmount
