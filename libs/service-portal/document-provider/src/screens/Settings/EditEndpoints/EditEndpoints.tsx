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
  EndpointsForm,
  EndpointsFormData,
} from '../../../components/Forms/EndpointsForm'

const EditEndpoints: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  const submitFormData = async (formData: EndpointsFormData) => {
    console.log(formData)
    toast.success('Endapunktur vistaður')
  }

  const handleSubmit = (data: EndpointsFormData) => {
    submitFormData(data)
  }
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h1" as="h1">
          {formatMessage(m.SettingsEditEndPointsTitle)}
        </Text>
      </Box>
      <EndpointsForm
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

export default EditEndpoints
