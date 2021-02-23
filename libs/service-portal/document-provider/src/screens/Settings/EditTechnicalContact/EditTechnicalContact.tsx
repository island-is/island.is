import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { TechnicalContactForm } from '../../../components/Forms/TechnicalContactForm'
import { useGetOrganisation } from '../../../shared/useGetOrganisation'
import { SettingsFormsLoader } from '../../../components/SettingsFormsLoader'

const EditTechnicalContact: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { organisation } = useGetOrganisation('123456-0000')

  const { technicalContact } = organisation || {}
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h1" as="h1">
          {formatMessage(m.SettingsEditTechnicalContactTitle)}
        </Text>
      </Box>
      {technicalContact ? (
        <TechnicalContactForm
          organisationId={organisation?.id}
          technicalContact={technicalContact}
        />
      ) : (
        <SettingsFormsLoader numberOfLoaders={4} />
      )}
    </Box>
  )
}

export default EditTechnicalContact
