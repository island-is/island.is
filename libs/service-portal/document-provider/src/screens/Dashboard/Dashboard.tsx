import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

const Dashboard: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'service.portal:document-provider',
          defaultMessage: 'Skjalaveita',
        })}
      </Text>
      <Text as="p">
        {formatMessage({
          id: 'sp.document-provider:dashboard-description',
          defaultMessage:
            'Á þessari síðu getur þú skoðað tölfræði yfir send skjöl.',
        })}
      </Text>
    </Box>
  )
}

export default Dashboard
