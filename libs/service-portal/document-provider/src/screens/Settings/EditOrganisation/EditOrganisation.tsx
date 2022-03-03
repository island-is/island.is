import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

import { InstitutionForm } from '../../../components/Forms/InstitutionForm'
import { SettingsFormsLoader } from '../../../components/SettingsFormsLoader'
import { m } from '../../../lib/messages'
import { useGetOrganisation } from '../../../shared/useGetOrganisation'

const EditOrganisation: ServicePortalModuleComponent = () => {
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
