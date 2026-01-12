import React from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { UserHelpForm } from '../../../components/Forms/UserHelpForm'
import { useGetOrganisation } from '../../../shared/useGetOrganisation'
import { SettingsFormsLoader } from '../../../components/SettingsFormsLoader'
import { PortalModuleComponent } from '@island.is/portals/core'

const EditUserHelpContact: PortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { organisation } = useGetOrganisation('123456-0000')

  const { helpdesk: helpDesk } = organisation || {}
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h3" as="h1">
          {formatMessage(m.SettingsEditUserHelpContactTitle)}
        </Text>
      </Box>
      {helpDesk ? (
        <UserHelpForm organisationId={organisation?.id} helpDesk={helpDesk} />
      ) : (
        <SettingsFormsLoader numberOfLoaders={3} />
      )}
    </Box>
  )
}

export default EditUserHelpContact
