import React from 'react'
import {
  useForm,
  FormProvider,
  Controller,
  SubmitHandler,
} from 'react-hook-form'

import {
  Box,
  Stack,
  Text,
  Divider,
  DatePicker,
  Button,
  Input,
  Select,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import {
  airlineOptions,
  financialStateOptions,
  genderOptions,
} from '../../consts'
import { FlightLegsFilters } from '../../types'

interface PropTypes {
  onSubmit: SubmitHandler<FlightLegsFilters>
  defaultValues: FlightLegsFilters
}

function Filters({ onSubmit, defaultValues }: PropTypes) {
  const hookFormData = useForm<FlightLegsFilters>({
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
                    size="xs"
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
                    size="xs"
                    selected={value}
                    handleChange={onChange}
                  />
                )}
              />
            </Stack>
            <Divider weight="purple200" />
            <Stack space={2}>
              <Text variant="h5">Flug</Text>
              <Controller
                name="airline"
                defaultValue=""
                render={({ onChange, value }) => {
                  return (
                    <Select
                      name="airline"
                      options={airlineOptions}
                      label="Flugfélag"
                      size="xs"
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
                    label="Brottfararstaður"
                    size="xs"
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
                    label="Áfangastaður"
                    size="xs"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Stack>
            <Divider weight="purple200" />
            <Stack space={2}>
              <Text variant="h5">Einstaklingur</Text>
              <Controller
                name="nationalId"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    name="nationalId"
                    label="Kennitala"
                    size="xs"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Stack>
            <Divider weight="purple200" />
            <Stack space={2}>
              <Text variant="h5">Notandi</Text>
              <Controller
                name="postalCode"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    name="postalCode"
                    label="Póstnúmer"
                    size="xs"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Columns space={[1, 2, 2, 1]}>
                <Column>
                  <Controller
                    name="age.from"
                    defaultValue=""
                    render={({ onChange, value }) => (
                      <Input
                        name="age.from"
                        label="Aldur frá"
                        size="xs"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Column>
                <Column>
                  <Controller
                    name="age.to"
                    defaultValue=""
                    render={({ onChange, value }) => (
                      <Input
                        name="age.to"
                        label="Aldur til"
                        size="xs"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Column>
              </Columns>
              <Controller
                name="gender"
                defaultValue=""
                render={({ onChange, value }) => {
                  return (
                    <Select
                      name="gender"
                      options={genderOptions}
                      label="Kyn"
                      size="xs"
                      value={genderOptions.find(
                        (option) => option.value === value,
                      )}
                      onChange={onChange}
                    />
                  )
                }}
              />
              <CheckboxController
                id="isExplicit"
                options={[{ value: 'true', label: 'Handvirkur kóði' }]}
              />
            </Stack>
            <Divider weight="purple200" />
            <Stack space={2}>
              <Text variant="h5">Fjármál</Text>
              <CheckboxController id="state" options={financialStateOptions} />
            </Stack>
            <Box paddingTop={2}>
              <Button type="submit" fluid>
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
