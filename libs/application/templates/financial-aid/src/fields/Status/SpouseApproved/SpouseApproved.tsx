import React from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { getNextPeriod } from '@island.is/financial-aid/shared/lib'

import { spouseApproved } from '../../../lib/messages'

const SpouseApproved = () => {
  const { formatMessage } = useIntl()

  return (
    <Text variant="h3" fontWeight="light" marginBottom={[4, 4, 5]}>
      {formatMessage(spouseApproved.message, {
        month: getNextPeriod.month,
      })}
    </Text>
  )
}

export default SpouseApproved
