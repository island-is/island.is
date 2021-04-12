import React from 'react'
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from 'react-hook-form'
import {
  Box,
  Stack,
  Typography,
  Divider,
  DatePicker,
  ButtonDeprecated as Button,
  Input,
  Select,
  Checkbox,
} from '@island.is/island-ui/core'

import * as styles from './EditForm.treat'

interface PropTypes {}

const NameTypes = {
  ST: 'ST',
  DR: 'DR',
  MI: 'MI',
  RST: 'RST',
  RDR: 'RDR',
} as { [key: string]: string }

const StatusTypes = {
  Haf: 'Hafnað',
  Sam: 'Samþykkt',
  Óaf: 'Óafgreitt',
} as { [key: string]: string }

export const nameTypeOptions = Object.keys(NameTypes).map((x: string) => {
  return {
    label: NameTypes[x],
    value: x,
  }
})

export const statusTypeOptions = Object.keys(StatusTypes).map((x: string) => {
  return {
    label: StatusTypes[x],
    value: x,
  }
})

const EditForm: React.FC<PropTypes> = () => {
  const hookFormData = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: false,
  })

  const { setValue } = hookFormData

  return (
    <FormProvider {...hookFormData}>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        height="full"
      >
        <Controller
          name="icelandicName"
          defaultValue=""
          render={({ onChange, value }) => (
            <Input
              name="icelandicName"
              label="Nafn"
              placeholder="Nafn"
              value={value}
              onChange={onChange}
              backgroundColor="blue"
            />
          )}
        />
        <Controller
          name="type"
          defaultValue=""
          render={({ onChange, value }) => {
            return (
              <Select
                name="type"
                options={nameTypeOptions}
                label="Tegund nafns"
                placeholder="Veldu tegund"
                value={nameTypeOptions.find((option) => option.value === value)}
                onChange={onChange}
                backgroundColor="blue"
                required
              />
            )
          }}
        />
        <Controller
          name="status"
          defaultValue=""
          render={({ onChange, value }) => {
            return (
              <Select
                name="status"
                options={statusTypeOptions}
                label="Staða"
                placeholder="Veldu stöðu"
                value={statusTypeOptions.find(
                  (option) => option.value === value,
                )}
                onChange={onChange}
                backgroundColor="blue"
                required
              />
            )
          }}
        />
        <Controller
          name="description"
          defaultValue=""
          render={({ onChange, value }) => {
            return (
              <Input
                name="description"
                label="Skýring"
                defaultValue=""
                textarea
                backgroundColor="blue"
              />
            )
          }}
        />
        <Controller
          name="url"
          defaultValue=""
          render={({ onChange, value }) => {
            return (
              <Input
                name="url"
                label="Úrskurður"
                placeholder="Vefslóð á úrskurð mannanafnanefndar"
                value={value}
                onChange={onChange}
                backgroundColor="blue"
              />
            )
          }}
        />
        <Controller
          name="visible"
          defaultValue={true}
          render={({ onChange, value }) => {
            return (
              <Checkbox
                name="visible"
                label="Birta i lista"
                onChange={(e) => {
                  const isChecked = Boolean(e.target.checked)
                  setValue('visible', isChecked)
                  onChange(isChecked)
                }}
                checked={value}
                backgroundColor="white"
                large
              />
            )
          }}
        />
      </Box>
    </FormProvider>
  )
}

export default EditForm
