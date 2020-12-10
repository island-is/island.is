import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

const TechnicalInformation: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'service.portal:technical-information',
          defaultMessage: 'Tæknilegar upplýsingar',
        })}
      </Text>
      <Text as="p">
        {formatMessage({
          id: 'sp.document-provider:technical-information-description',
          defaultMessage:
            'Á þessari síðu sérð þú upplýsingar um tæknileg atriði',
        })}
      </Text>
    </Box>
  )
}

export default TechnicalInformation
