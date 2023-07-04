import React from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { ResponsibleContactForm } from '../../../components/Forms/ResponsibleContactForm'
import { useGetOrganisation } from '../../../shared/useGetOrganisation'
import { SettingsFormsLoader } from '../../../components/SettingsFormsLoader'
import { PortalModuleComponent } from '@island.is/portals/core'

const EditResponsibleContact: PortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { organisation } = useGetOrganisation('123456-0000')

  const { administrativeContact } = organisation || {}
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h3" as="h1">
          {formatMessage(m.SettingsEditResponsibleContactTitle)}
        </Text>
      </Box>
      {administrativeContact ? (
        <ResponsibleContactForm
          organisationId={organisation?.id}
          administrativeContact={administrativeContact}
        />
      ) : (
        <SettingsFormsLoader numberOfLoaders={4} />
      )}
    </Box>
  )
}

export default EditResponsibleContact
