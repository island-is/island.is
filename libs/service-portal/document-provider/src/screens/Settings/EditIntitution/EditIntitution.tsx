import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

const EditIntitution: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'sp.document-provider:edit-institution',
          defaultMessage: 'Breyta stofnun',
        })}
      </Text>
      <Text as="p">
        {formatMessage({
          id: 'sp.document-provider:edit-institution-description',
          defaultMessage: 'Hér kemur form fyrir stofnun TODO',
        })}
      </Text>
    </Box>
  )
}

export default EditIntitution
