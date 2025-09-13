import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { StatisticsSearch } from '../../components/StatisticsSearch'
import { PortalModuleComponent } from '@island.is/portals/core'

const Statistics: PortalModuleComponent = () => {
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
