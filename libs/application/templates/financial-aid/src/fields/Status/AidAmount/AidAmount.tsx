import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  acceptedAmountBreakDown,
  Amount,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

import { aidAmount } from '../../../lib/messages'
import { FAApplication } from '../../../lib/types'
import { Breakdown } from '../../index'
import { Estimation } from '../index'

interface Props {
  application: FAApplication
  state?: ApplicationState
  amount?: Amount
}

const AidAmount = ({ application, state, amount }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      {state === ApplicationState.APPROVED ? (
        <>
          <Text as="h3" variant="h3" marginBottom={2}>
            {formatMessage(aidAmount.titleApproved)}
          </Text>
          <Breakdown calculations={acceptedAmountBreakDown(amount)} />
        </>
      ) : (
        <Estimation application={application} />
      )}
    </Box>
  )
}

export default AidAmount
