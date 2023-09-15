import React from 'react'
import { Form } from 'react-router-dom'

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
  Checkbox,
} from '@island.is/island-ui/core'
import {
  airlineOptions,
  financialStateOptions,
  genderOptions,
} from '../../consts'
import type { FlightLegsFilters } from '../../Overview.loader'

interface FiltersPropTypes {
  defaultValues: FlightLegsFilters
}

export const Filters = ({ defaultValues }: FiltersPropTypes) => {
  return (
    <Stack space={3}>
      <Form
        onSubmit={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
        >
          <Stack space={4}>
            <Stack space={2}>
              <DatePicker
                label="Frá"
                id="period.from"
                name="period.from"
                placeholderText="Veldu dagsetningu"
                locale="is"
                size="xs"
                selected={new Date(defaultValues.period.from)}
              />
              <DatePicker
                label="Til"
                id="period.to"
                name="period.to"
                placeholderText="Veldu dagsetningu"
                locale="is"
                size="xs"
                selected={new Date(defaultValues.period.to)}
              />
            </Stack>
            <Divider weight="purple200" />
            <Stack space={2}>
              <Text variant="h5">Flug</Text>
              <Select
                name="airline"
                options={airlineOptions}
                label="Flugfélag"
                size="xs"
                defaultValue={airlineOptions.find(
                  (option) => option.value === defaultValues.airline,
                )}
              />

              <Input
                name="flightLeg.from"
                label="Brottfararstaður"
                size="xs"
                defaultValue={defaultValues.flightLeg?.from}
              />
              <Input
                name="flightLeg.to"
                label="Áfangastaður"
                size="xs"
                defaultValue={defaultValues.flightLeg?.to}
              />
            </Stack>
            <Divider weight="purple200" />
            <Stack space={2}>
              <Text variant="h5">Einstaklingur</Text>
              <Input
                name="nationalId"
                label="Kennitala"
                size="xs"
                defaultValue={defaultValues.nationalId}
              />
            </Stack>
            <Divider weight="purple200" />
            <Stack space={2}>
              <Text variant="h5">Notandi</Text>
              <Input
                name="postalCode"
                label="Póstnúmer"
                size="xs"
                defaultValue={defaultValues.postalCode}
              />
              <Columns space={[1, 2, 2, 1]}>
                <Column>
                  <Input
                    name="age.from"
                    label="Aldur frá"
                    size="xs"
                    defaultValue={
                      defaultValues.age.from > -1
                        ? defaultValues.age.from
                        : undefined
                    }
                  />
                </Column>
                <Column>
                  <Input
                    name="age.to"
                    label="Aldur til"
                    size="xs"
                    defaultValue={
                      defaultValues.age.to < 1000
                        ? defaultValues.age.to
                        : undefined
                    }
                  />
                </Column>
              </Columns>
              <Select
                name="gender"
                options={genderOptions}
                label="Kyn"
                size="xs"
                defaultValue={genderOptions.find(
                  (option) => option.value === defaultValues.gender,
                )}
              />
              <Checkbox
                name="isExplicit"
                id="isExplicit"
                label="Handvirkur kóði"
                value="true"
                defaultChecked={defaultValues.isExplicit}
              />
            </Stack>
            <Divider weight="purple200" />
            <Stack space={2}>
              <Text variant="h5">Fjármál</Text>
              {financialStateOptions.map(({ value, label }, index) => (
                <Checkbox
                  key={value}
                  id={`state-${index}`}
                  name="state"
                  value={value}
                  defaultChecked={defaultValues.state.includes(value)}
                  label={label}
                />
              ))}
            </Stack>
            <Box paddingTop={2}>
              <Button type="submit" fluid>
                Beita síu
              </Button>
            </Box>
          </Stack>
        </Box>
      </Form>
    </Stack>
  )
}
