import React, { useEffect, useState } from 'react'
import {
  Stack,
  Box,
  Text,
  DatePicker,
  Divider,
  Input,
  Button,
} from '@island.is/island-ui/core'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { ApplicationData } from './../../entities/application-data'
import ValidationUtils from './../../utils/validation.utils'

interface PropTypes {
  onSubmit: (data) => void
  defaultValues: ApplicationData
}

const ChildrenUnderCare: React.FC<PropTypes> = ({
  onSubmit,
  defaultValues,
}: PropTypes) => {
  const hookFormData = useForm<ApplicationData>()
  //  const [applicationData, setApplicationData] = useState<ApplicationData>(new ApplicationData)

  const submit = () => {
    const application = new ApplicationData()
    application.initialInfo = hookFormData.getValues().initialInfo

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
        >
          <Stack space={2}>
            <Controller
              name="initialInfo.email"
              defaultValue={defaultValues.initialInfo.email}
              render={({ onChange, value }) => (
                <Input
                  name="initialInfo.email"
                  placeholder="Netfang"
                  value={value}
                  onChange={onChange}
                  label="Netfang"
                  required={true}
                  errorMessage="Nauðsynlegt er að fylla út netfang"
                  hasError={!ValidationUtils.validateEmail(value)}
                />
              )}
            />
          </Stack>

          <Stack space={2}>
            <Divider weight="alternate" />
            <Controller
              name="initialInfo.mobile"
              defaultValue={defaultValues.initialInfo.mobile}
              render={({ onChange, value }) => (
                <Input
                  name="initialInfo.mobile"
                  placeholder="Farsími"
                  value={value}
                  onChange={onChange}
                  label="Farsími"
                  required={true}
                  errorMessage="Nauðsynlegt er að fylla út farsímanúmer"
                  hasError={!ValidationUtils.validatePhoneNumber(value)}
                />
              )}
            />
          </Stack>
        </Box>
        <Box paddingTop={2}>
          <Button onClick={submit}>Næsta skref</Button>
        </Box>
      </FormProvider>
    </Stack>
  )
}

export default ChildrenUnderCare
