import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

const DocumentProviders: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'service.portal:document-provider-document-providers',
          defaultMessage: 'Skjalaveitendur',
        })}
      </Text>
      <Text as="p">
        {formatMessage({
          id: 'sp.document-provider:document-providers-description',
          defaultMessage:
            'Einungis fyrir starfsmenn island.is. Á þessari síðu sérð þú yfirlit yfir alla skjalaveitendur',
        })}
      </Text>
    </Box>
  )
}

export default DocumentProviders
