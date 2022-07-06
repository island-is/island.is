import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { StatisticsSearch } from '../../components/StatisticsSearch'

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
