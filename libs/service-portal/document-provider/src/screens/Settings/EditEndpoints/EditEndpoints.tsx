import React from 'react'

import { Box, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

import {
  EndpointsForm,
  EndpointsFormData,
} from '../../../components/Forms/EndpointsForm'
import { m } from '../../../lib/messages'

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
        <Text variant="h3" as="h1">
          {formatMessage(m.SettingsEditEndPointsTitle)}
        </Text>
      </Box>
      <EndpointsForm onSubmit={handleSubmit} />
    </Box>
  )
}

export default EditEndpoints
