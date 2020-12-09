import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

const MyCategories: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'service.portal:document-provider-my-categories',
          defaultMessage: 'Mínir flokkar',
        })}
      </Text>
      <Text as="p">
        {formatMessage({
          id: 'sp.document-provider:my-categories-description',
          defaultMessage:
            'Einungis fyrir skjalaveitendur. Á þessari síðu getur þú bætt/breytt/eytt flokkum... TODO LAST',
        })}
      </Text>
    </Box>
  )
}

export default MyCategories
