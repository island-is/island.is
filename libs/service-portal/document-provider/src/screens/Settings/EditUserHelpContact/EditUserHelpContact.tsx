import React from 'react'
import { Link } from 'react-router-dom'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text, Button, toast } from '@island.is/island-ui/core'
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
      <UserHelpForm
        onSubmit={handleSubmit}
        renderBackButton={() => (
          <Link to={ServicePortalPath.DocumentProviderSettingsRoot}>
            <Button variant="ghost">Til baka</Button>
          </Link>
        )}
        renderSubmitButton={() => (
          <Button type="submit" variant="primary" icon="arrowForward">
            Vista breytingar
          </Button>
        )}
      />
    </Box>
  )
}

export default EditUserHelpContact
