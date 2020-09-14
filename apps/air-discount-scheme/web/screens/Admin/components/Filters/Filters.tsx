import React from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'

import { Airlines, States } from '@island.is/air-discount-scheme/consts'
import { Checkbox } from '@island.is/air-discount-scheme-web/components'
import {
  Box,
  Stack,
  Typography,
  Divider,
  DatePicker,
  Button,
  Input,
  Select,
} from '@island.is/island-ui/core'
import { FilterInput } from '../../Admin'

interface PropTypes {
  onSubmit: (data) => void
  defaultValues: FilterInput
}

const airlineOptions = [
  {
    label: 'Öll flugfélög',
    value: null,
  },
  {
    label: 'Ernir',
    value: Airlines.ernir,
  },
  {
    label: 'Icelandair',
    value: Airlines.icelandair,
  },
  {
    label: 'Norlandair',
    value: Airlines.norlandair,
  },
]

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
                defaultValue=""
                name="period.from"
                render={({ onChange, value }) => (
                  <DatePicker
                    label="Frá"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    value={value.toString() || undefined}
                    handleChange={onChange}
                  />
                )}
              />
              <Controller
                defaultValue=""
                name="period.to"
                render={({ onChange, value }) => (
                  <DatePicker
                    label="Til"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    value={value.toString() || undefined}
                    handleChange={onChange}
                  />
                )}
              />
            </Stack>
            <Stack space={2}>
              <Typography variant="h5">Flug</Typography>
              <Divider weight="alternate" />
              <Controller
                defaultValue=""
                name="airline"
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
                defaultValue=""
                name="flightLeg.from"
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
                defaultValue=""
                name="flightLeg.to"
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
              <Typography variant="h5">Notandi</Typography>
              <Divider weight="alternate" />
              <Controller
                defaultValue=""
                name="postalCode"
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
                defaultValue=""
                name="age.from"
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
                defaultValue=""
                name="age.to"
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
                ]}
              />
            </Stack>
            <Stack space={2}>
              <Typography variant="h5">Fjármál</Typography>
              <Divider weight="alternate" />
              <Checkbox
                name="state"
                options={[
                  {
                    value: States.awaitingDebit,
                    label: 'Á eftir að gjaldfæra',
                  },
                  { value: States.sentDebit, label: 'Gjaldfært' },
                  {
                    value: States.awaitingCredit,
                    label: 'Á eftir að endurgreiða',
                  },
                  { value: States.sentCredit, label: 'Endurgreitt' },
                  { value: States.cancelled, label: 'Afturkallað' },
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

export default Filters
