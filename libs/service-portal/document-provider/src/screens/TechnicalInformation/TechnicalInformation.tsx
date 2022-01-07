import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

const TechnicalInformation: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h3" as="h1">
        {formatMessage(m.TechnicalInformationTitle)}
      </Text>
      <Text as="p">{formatMessage(m.TechnicalInformationDescription)}</Text>
    </Box>
  )
}

export default TechnicalInformation
