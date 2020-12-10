import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

const EditUserHelpContact: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'sp.document-provider:edit-user-help-contact',
          defaultMessage: 'Breyta notendaaðstoð',
        })}
      </Text>
      <Text as="p">
        {formatMessage({
          id: 'sp.document-provider:edit-user-help-description',
          defaultMessage: 'Hér kemur form fyrir notendaaðstoð TODO',
        })}
      </Text>
    </Box>
  )
}

export default EditUserHelpContact
