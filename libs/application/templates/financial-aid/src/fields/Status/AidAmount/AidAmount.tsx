import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  acceptedAmountBreakDown,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

import { aidAmount } from '../../../lib/messages'
import { FAApplication } from '../../../lib/types'
import { Breakdown } from '../../index'
import { Estimation } from '../index'

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
            {formatMessage(aidAmount.titleApproved)}
          </Text>
          {/* TODO: use real aid amount */}
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
