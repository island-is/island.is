import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text, Input, Stack } from '@island.is/island-ui/core'

export interface InstitutionFormData {
  name: string
  nationalId: string
  address: string
  email: string
  tel: string
}

//TODO fetch values and set values

const EditIntitution: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'sp.document-provider:edit-responsible-contact',
            defaultMessage: 'Breyta stofnun',
          })}
        </Text>
      </Box>
      <Stack space={2}>
        <Input
          name="id1"
          label="Nafn á stofnun"
          value="Advania"
          disabled
        ></Input>
        <Input name="id2" label="Kennitala" value="5409298989" disabled></Input>
        <Input
          name="id3"
          label="Heimilisfang"
          value="Guðrúnartún 10, 105 Reykjavík"
          disabled
        ></Input>
        <Input name="id2" label="Netfang" placeholder="Netfang"></Input>
        <Input name="id2" label="Símanúmer" placeholder="Símanúmer"></Input>
      </Stack>
    </Box>
  )
}

export default EditIntitution
