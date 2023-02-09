import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'
import InputMask from 'react-input-mask'

import { Box, Input, Select, Button } from '@island.is/island-ui/core'
import {
  ReactSelectOption,
  TempCase as Case,
} from '@island.is/judicial-system-web/src/types'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts'
import { IndictmentCount as TIndictmentCount } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'

import { indictmentCount as strings } from './IndictmentCount.strings'

interface Props {
  indictmentCount: TIndictmentCount
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  onChange: (
    indictmentCountId: string,
    updatedIndictmentCount: UpdateIndictmentCount,
  ) => void
  onDelete?: (indictmentCountId: string) => Promise<void>
  updateIndictmentCountState: (
    indictmentCountId: string,
    update: UpdateIndictmentCount,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
  ) => void
}

export const IndictmentCount: React.FC<Props> = (props) => {
  const {
    indictmentCount,
    workingCase,
    onChange,
    onDelete,
    updateIndictmentCountState,
    setWorkingCase,
  } = props
  const { formatMessage } = useIntl()

  const [
    vehicleRegistrationNumberErrorMessage,
    setVehicleRegistrationNumberErrorMessage,
  ] = useState<string>('')

  function todoHandle(index: number) {
    //(index, 'todo')
  }

  const todoOptions = [
    'Sviptingarakstur',
    'Ölvunarakstur',
    'Fíkniefnaakstur',
  ].map((option) => ({
    value: option,
    label: option,
  }))

  return (
    <BlueBox>
      {onDelete && (
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button
            onClick={() => onDelete(indictmentCount.id)}
            colorScheme="destructive"
            variant="text"
            size="small"
          >
            {formatMessage(strings.delete)}
          </Button>
        </Box>
      )}
      <Box marginBottom={2}>
        <Select
          name="policeCaseNumber"
          options={workingCase.policeCaseNumbers.map((val) => ({
            value: val,
            label: val,
          }))}
          label={formatMessage(strings.policeCaseNumberLabel)}
          placeholder={formatMessage(strings.policeCaseNumberPlaceholder)}
          onChange={(so: ValueType<ReactSelectOption>) => {
            onChange(indictmentCount.id, {
              policeCaseNumber: (so as ReactSelectOption).value as string,
            })
          }}
          value={
            workingCase.policeCaseNumbers
              .map((val) => ({
                value: val,
                label: val,
              }))
              .find(
                (val) =>
                  val?.value === indictmentCount.policeCaseNumber?.toString(),
              ) ?? null
          }
          required
        />
      </Box>
      <Box marginBottom={2}>
        <InputMask
          mask={'**-*99'}
          maskPlaceholder={null}
          value={indictmentCount.vehicleRegistrationNumber ?? ''}
          beforeMaskedStateChange={({ nextState }) => {
            let { value } = nextState
            value = value.toUpperCase()

            return { ...nextState, value }
          }}
          onChange={(event) => {
            console.log(event, 'onChange')
            removeErrorMessageIfValid(
              ['empty', 'vehicle-registration-number'],
              event.target.value,
              vehicleRegistrationNumberErrorMessage,
              setVehicleRegistrationNumberErrorMessage,
            )

            updateIndictmentCountState(
              indictmentCount.id,
              {
                vehicleRegistrationNumber: event.target.value,
              },
              setWorkingCase,
            )
          }}
          onBlur={async (event) => {
            console.log(event, 'onBlur')
            validateAndSetErrorMessage(
              ['empty', 'vehicle-registration-number'],
              event.target.value,
              setVehicleRegistrationNumberErrorMessage,
            )
            onChange(indictmentCount.id, {
              vehicleRegistrationNumber: event.target.value,
            })
          }}
        >
          <Input
            name="vehicleRegistrationNumber"
            autoComplete="off"
            label={formatMessage(strings.vehicleRegistrationNumberLabel)}
            placeholder={formatMessage(
              strings.vehicleRegistrationNumberPlaceholder,
            )}
            hasError={vehicleRegistrationNumberErrorMessage !== ''}
            errorMessage={vehicleRegistrationNumberErrorMessage}
            required
          />
        </InputMask>
      </Box>
      {/* TODO: Finish rest of form here below*/}
      <Box marginBottom={2}>
        <Select
          name="incident"
          options={todoOptions}
          label={formatMessage(strings.incidentLabel)}
          placeholder={formatMessage(strings.incidentPlaceholder)}
          onChange={() => {
            todoHandle(1)
          }}
          value={null}
          required
        />
      </Box>
      <Box marginBottom={2}>
        <Select
          name="legalArgument"
          icon="search"
          options={todoOptions}
          label={formatMessage(strings.legalArgumentLabel)}
          placeholder={formatMessage(strings.legalArgumentPlaceholder)}
          value={null}
          onChange={() => {
            todoHandle(1)
          }}
          filterConfig={{ matchFrom: 'start' }}
          isCreatable
        />
      </Box>
      <Box component="section" marginBottom={2}>
        <Box marginBottom={2}>
          <Input
            name="incidentDescription"
            label={formatMessage(strings.incidentDescriptionLabel)}
            placeholder={formatMessage(strings.incidentDescriptionPlaceholder)}
            errorMessage={''}
            hasError={false}
            value={''}
            onChange={() => todoHandle(1)}
            onBlur={() => todoHandle(1)}
            required
            rows={7}
            autoExpand={{ on: true, maxHeight: 600 }}
            textarea
          />
        </Box>
      </Box>
      <Box component="section" marginBottom={2}>
        <Box marginBottom={2}>
          <Input
            name="legalArgumentDescription"
            label={formatMessage(strings.legalArgumentDescriptionLabel)}
            placeholder={formatMessage(
              strings.legalArgumentDescriptionPlaceholder,
            )}
            errorMessage={''}
            hasError={false}
            value={''}
            onChange={() => todoHandle(1)}
            onBlur={() => todoHandle(1)}
            required
            rows={7}
            autoExpand={{ on: true, maxHeight: 600 }}
            textarea
          />
        </Box>
      </Box>
    </BlueBox>
  )
}
