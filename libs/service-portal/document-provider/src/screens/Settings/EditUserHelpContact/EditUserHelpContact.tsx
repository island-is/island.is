import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text, toast } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import {
  UserHelpForm,
  UserHelpFormData,
} from '../../../components/Forms/UserHelpForm'

const EditUserHelpContact: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  const handleSubmit = (data: UserHelpFormData) => {
    submitFormData(data)
  }

  const submitFormData = async (formData: UserHelpFormData) => {
    //TODO: Set up submit
    console.log(formData)
    toast.success('Notendaaðstoð vistuð')
  }
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h1" as="h1">
          {formatMessage(m.SettingsEditUserHelpContactTitle)}
        </Text>
      </Box>
      <UserHelpForm onSubmit={handleSubmit} />
    </Box>
  )
}

export default EditUserHelpContact
