import React from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'

import { Checkbox } from '@island.is/air-discount-scheme-web/components'
import {
  Box,
  Stack,
  Typography,
  Divider,
  DatePicker,
  ButtonDeprecated as Button,
  Input,
  Select,
} from '@island.is/island-ui/core'
import {
  airlineOptions,
  financialStateOptions,
  FilterInput,
} from '../../consts'

interface PropTypes {
  onSubmit: (data) => void
  defaultValues: FilterInput
}

function Filters({ onSubmit, defaultValues }: PropTypes) {
  const hookFormData = useForm<FilterInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: defaultValues,
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
                name="period.from"
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
              <Typography variant="h5">Flug</Typography>
              <Divider weight="alternate" />
              <Controller
                name="airline"
                defaultValue=""
                render={({ onChange, value }) => {
                  return (
                    <Select
                      name="airline"
                      options={airlineOptions}
                      placeholder="Flugfélag"
                      value={airlineOptions.find(
                        (option) => option.value === value,
                      )}
                      onChange={onChange}
                    />
                  )
                }}
              />
              <Controller
                name="flightLeg.from"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    name="flightLeg.from"
                    placeholder="Brottfararstaður"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name="flightLeg.to"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    name="flightLeg.to"
                    placeholder="Áfangastaður"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Stack>
            <Stack space={2}>
              <Typography variant="h5">Einstaklingur</Typography>
              <Divider weight="alternate" />
              <Controller
                name="nationalId"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    name="nationalId"
                    placeholder="Kennitala"
                    value={value}
                    onChange={onChange}
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
            <Stack space={2}>
              <Typography variant="h5">Fjármál</Typography>
              <Divider weight="alternate" />
              <Checkbox name="state" options={financialStateOptions} />
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

export default Filters
