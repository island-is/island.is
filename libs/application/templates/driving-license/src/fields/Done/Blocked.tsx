import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { Company } from '../../assets'

export const Blocked = ({ application }: FieldBaseProps): JSX.Element => {
  const { formatMessage } = useLocale()
  return (
    <Box height="full" paddingTop={2}>
      <Text>
        {formatText(m.blockedDescription, application, formatMessage)}
      </Text>
      <Box display="flex" justifyContent="center" width="full">
        <Company />
      </Box>
    </Box>
  )
}
