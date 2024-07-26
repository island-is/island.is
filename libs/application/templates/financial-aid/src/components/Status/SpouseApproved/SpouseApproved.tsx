import React from 'react'
import { useIntl } from 'react-intl'
import { Text } from '@island.is/island-ui/core'
import { getNextPeriod } from '@island.is/financial-aid/shared/lib'
import { useLocale } from '@island.is/localization'
import { spouseApproved } from '../../../lib/messages'

const SpouseApproved = () => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  return (
    <Text variant="h3" fontWeight="light" marginBottom={[4, 4, 5]}>
      {formatMessage(spouseApproved.message, {
        month: getNextPeriod(lang).month,
      })}
    </Text>
  )
}

export default SpouseApproved
