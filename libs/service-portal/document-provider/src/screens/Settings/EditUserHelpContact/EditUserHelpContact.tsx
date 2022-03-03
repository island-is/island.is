import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

import { UserHelpForm } from '../../../components/Forms/UserHelpForm'
import { SettingsFormsLoader } from '../../../components/SettingsFormsLoader'
import { m } from '../../../lib/messages'
import { useGetOrganisation } from '../../../shared/useGetOrganisation'

const EditUserHelpContact: ServicePortalModuleComponent = ({ userInfo }) => {
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
