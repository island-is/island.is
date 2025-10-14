import React from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { PortalModuleComponent } from '@island.is/portals/core'

const MyCategories: PortalModuleComponent = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h3" as="h1">
        {formatMessage(m.myCategoriesTitle)}
      </Text>
      <Text as="p">{formatMessage(m.myCategoriesDescription)}</Text>
    </Box>
  )
}

export default MyCategories
