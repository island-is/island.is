import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

const MyCategories: ServicePortalModuleComponent = ({ userInfo }) => {
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
