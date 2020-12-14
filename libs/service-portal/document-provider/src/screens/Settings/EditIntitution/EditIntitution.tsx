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
  InstitutionForm,
  InstitutionFormData,
} from '../../../components/Forms/InstitutionForm'

//TODO fetch values and set values

const EditIntitution: ServicePortalModuleComponent = ({}) => {
  const { formatMessage } = useLocale()

  const handleSubmit = (data: InstitutionFormData) => {
    submitFormData(data)
  }

  const submitFormData = async (formData: InstitutionFormData) => {
    //TODO: Set up submit
    console.log(formData)
    toast.success('Stofnun vistuð')
  }

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h1" as="h1">
          {formatMessage(m.SettingsEditInstitutionTitle)}
        </Text>
      </Box>
      <InstitutionForm
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

export default EditIntitution
