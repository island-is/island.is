import React from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { InstitutionForm } from '../../../components/Forms/InstitutionForm'
import { useGetOrganisation } from '../../../shared/useGetOrganisation'
import { SettingsFormsLoader } from '../../../components/SettingsFormsLoader'
import { PortalModuleComponent } from '@island.is/portals/core'

const EditOrganisation: PortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { organisation, loading } = useGetOrganisation('123456-0000')

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h3" as="h1">
          {formatMessage(m.SettingsEditInstitutionTitle)}
        </Text>
      </Box>
      {loading ? (
        <SettingsFormsLoader numberOfLoaders={6} />
      ) : (
        <InstitutionForm organisation={organisation} />
      )}
    </Box>
  )
}

export default EditOrganisation
