import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

const Settings: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'service.portal:document-provider-settings',
          defaultMessage: 'Stillingar',
        })}
      </Text>
      <Text as="p">
        {formatMessage({
          id: 'sp.document-provider:settings-description',
          defaultMessage: 'Á þessari síðu getur þú breytt stillingum',
        })}
      </Text>
    </Box>
  )
}

export default Settings
