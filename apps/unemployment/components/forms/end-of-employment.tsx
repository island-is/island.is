import React, { useEffect } from 'react'
import {
  Stack,
  Box,
  Typography,
  DatePicker,
  Divider,
  Input,
  Button,
} from '@island.is/island-ui/core'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { ApplicationData } from './../../entities/application-data'
import { ApplicationService } from './../../services/application.service'

interface PropTypes {
  onSubmit: (data) => void
  defaultValues: ApplicationData
}

const EndOfEmployment: React.FC<PropTypes> = ({
  onSubmit,
  defaultValues,
}: PropTypes) => {
  const hookFormData = useForm<ApplicationData>()


  const submit = () => {
    const application = defaultValues
    application.initialInfo.dateFrom = hookFormData.getValues().initialInfo.dateFrom
    ApplicationService.saveApplication(application)
    onSubmit(hookFormData.getValues())
  }

  useEffect(() => {
   // setApplicationData(defaultValues)
    console.log(defaultValues)
  }, [defaultValues])

  // console.log(defaultValues)

  return (
    <Stack space={3}>
      <FormProvider {...hookFormData}>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
          onSubmit={submit}
        >
            <Stack space={2}>
            <Controller
                name="dateFrom"
                defaultValue={defaultValues?.initialInfo?.dateFrom ? defaultValues?.initialInfo?.dateFrom : new Date()}
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
        <Box paddingTop={2}>
              <Button onClick={submit} width="fluid">
                Næsta skref
              </Button>
            </Box>
      </FormProvider>
    </Stack>
  )
}

export default PersonalInformation
