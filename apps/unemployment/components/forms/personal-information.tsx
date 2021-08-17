import React from 'react'
import {
  Stack,
  Box,
  Typography,
  DatePicker,
  Divider,
  Input,
} from '@island.is/island-ui/core'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { ApplicationData } from './../../entities/application-data'

interface PropTypes {
  onSubmit: (data) => void
  defaultValues: ApplicationData
}

const PersonalInformation: React.FC<PropTypes> = ({
  onSubmit,
  defaultValues,
}: PropTypes) => {
  const hookFormData = useForm<ApplicationData>()

  console.log(defaultValues)

  return (
    <Stack space={3}>
      <FormProvider {...hookFormData}>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
          onSubmit={hookFormData.handleSubmit(onSubmit)}
        >
            <Stack space={2}>
              <Typography variant="h5">Persónuupplýsingar</Typography>
              <Divider weight="alternate" />
              <Controller
                name="initialInfo.name"
                defaultValue={defaultValues.initialInfo.name}
                
                render={({ onChange, value }) => (
                  <Input
                    name="initialInfo.name"
                    placeholder="Fullt nafn"
                    value={value}
                    onChange={onChange}
                    readOnly={true}
                  />
                )}
              />
            </Stack>

            <Stack space={2}>
            <Controller
                name="fromDate"
                defaultValue=""
                render={({ onChange, value }) => (
                  <DatePicker
                    label="Frá"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    selected={value}
                    handleChange={onChange}
                  />
                )}
              />
            </Stack>
        </Box>
      </FormProvider>
    </Stack>
  )
}

export default PersonalInformation
