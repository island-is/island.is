import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { OverviewAssets } from './OverviewAssets'
import { OverviewDebts } from './OverviewDebts'
import { OverviewHeirs } from './OverviewHeirs'

export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginBottom={4}>
        <Text variant="h3">{formatMessage(m.properties)}</Text>
        <OverviewAssets {...props} />
      </Box>

      <Box marginBottom={4}>
        <Divider />
      </Box>

      <Box marginBottom={4}>
        <Text variant="h3">{formatMessage(m.debtsAndFuneralCost)}</Text>
        <OverviewDebts {...props} />
      </Box>

      <Box marginBottom={4}>
        <Divider />
      </Box>

      <Box marginBottom={4}>
        <Text variant="h3">{formatMessage(m.heirs)}</Text>
        <OverviewHeirs {...props} />
      </Box>
    </Box>
  )
}

export default Overview

