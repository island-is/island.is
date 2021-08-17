import React from 'react'
import {
  Stack,
  Box,
  Typography,
  DatePicker,
  Divider,
  Input,
  Button,
  Checkbox,
} from '@island.is/island-ui/core'
import { useForm, FormProvider, Controller } from 'react-hook-form'

interface PropTypes {
  onSubmit: (data) => void
  defaultValues: any
}

const PersonalInformation: React.FC<PropTypes> = ({
  onSubmit,
  defaultValues,
}: PropTypes) => {
  const hookFormData = useForm<any>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: null,
    shouldUnregister: false,
  })

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
          <Stack space={4}>
            <Stack space={2}>
              <Controller
                name="eriod.from"
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
              <Controller
                name="period.to"
                defaultValue=""
                render={({ onChange, value }) => (
                  <DatePicker
                    label="Til"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    selected={value}
                    handleChange={onChange}
                  />
                )}
              />
            </Stack>
            <Stack space={2}>
              <Typography variant="h5">Notandi</Typography>
              <Divider weight="alternate" />
              <Controller
                name="postalCode"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    name="postalCode"
                    placeholder="Póstnúmer"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name="age.from"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    name="age.from"
                    placeholder="Aldur frá"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name="age.to"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    name="age.to"
                    placeholder="Aldur til"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Checkbox
                name="gender"
                options={[
                  { value: 'kk', label: 'kk' },
                  { value: 'kvk', label: 'kvk' },
                  { value: 'hvk', label: 'hvk' },
                ]}
              />
            </Stack>
            <Box paddingTop={2}>
              <Button htmlType="submit" width="fluid">
                Beita síu
              </Button>
            </Box>
          </Stack>
        </Box>
      </FormProvider>
    </Stack>
  )
}

export default PersonalInformation
