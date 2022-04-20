import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  Amount,
  acceptedAmountBreakDown,
} from '@island.is/financial-aid/shared/lib'

import { Breakdown } from '../..'
import { status } from '../../../lib/messages'
import Estimation from '../Estimation/Estimation'
import { ApproveOptions, FAApplication } from '../../../lib/types'

interface Props {
  amount: Amount
  application: FAApplication
  type: 'estimation' | 'breakdown'
}

const Approved = ({ application, type, amount }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      {type === 'breakdown' ? (
        <>
          <Text as="h3" variant="h3" marginBottom={2}>
            {formatMessage(status.aidAmount.titleApproved)}
          </Text>
          <Breakdown calculations={acceptedAmountBreakDown(amount)} />
        </>
      ) : (
        <Estimation application={application} />
      )}
    </Box>
  )
}

export default Approved
