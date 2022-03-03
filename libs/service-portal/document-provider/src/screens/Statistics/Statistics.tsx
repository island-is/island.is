import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

import { StatisticsSearch } from '../../components/StatisticsSearch'
import { m } from '../../lib/messages'

const Statistics: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={[2, 3]}>
        <Text variant="h3" as="h1">
          {formatMessage(m.StatisticsTitle)}
        </Text>
      </Box>
      <Text as="p">{formatMessage(m.StatisticsDescription)}</Text>
      <StatisticsSearch />
    </Box>
  )
}

export default Statistics
