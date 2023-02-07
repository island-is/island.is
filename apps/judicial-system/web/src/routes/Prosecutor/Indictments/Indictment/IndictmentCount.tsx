import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Input, Select, Button } from '@island.is/island-ui/core'
import {
  ReactSelectOption,
  TempCase as Case,
} from '@island.is/judicial-system-web/src/types'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import { IndictmentCount as TIndictmentCount } from '@island.is/judicial-system-web/src/graphql/schema'

import { indictmentCount as strings } from './IndictmentCount.strings'

interface Props {
  indictmentCount: TIndictmentCount
  workingCase: Case
  onChange: (
    indictmentCountId: string,
    indictmentCount: TIndictmentCount,
  ) => void
  onDelete?: (indictmentCountId: string) => Promise<void>
}

export const IndictmentCount: React.FC<Props> = (props) => {
  const { indictmentCount, workingCase, onChange, onDelete } = props
  const { formatMessage } = useIntl()

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
          name="policeNumber"
          options={workingCase.policeCaseNumbers.map((val) => ({
            value: val,
            label: val,
          }))}
          label={formatMessage(strings.policeNumber.label)}
          placeholder={formatMessage(strings.policeNumber.placeholder)}
          onChange={(so: ValueType<ReactSelectOption>) => {
            onChange(indictmentCount.id, {
              ...indictmentCount,
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
      {/* TODO: Finish rest of form here below*/}
      <Box marginBottom={2}>
        <Input
          name="vehicleLicensePlate"
          autoComplete="off"
          label={formatMessage(strings.vehicleLicencePlate.label)}
          placeholder={formatMessage(strings.vehicleLicencePlate.placeholder)}
          value={''}
          onChange={() => {
            todoHandle(1)
          }}
        />
      </Box>
      <Box marginBottom={2}>
        <Select
          name="lawBreak"
          options={todoOptions}
          label={formatMessage(strings.lawBreak.label)}
          placeholder={formatMessage(strings.lawBreak.placeholder)}
          onChange={() => {
            todoHandle(1)
          }}
          value={null}
          required
        />
      </Box>
      <Box marginBottom={2}>
        <Select
          name={'lawsBroken'}
          icon="search"
          options={todoOptions}
          label={formatMessage(strings.lawBroken.label)}
          placeholder={formatMessage(strings.lawBroken.placeholder)}
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
            name="lawBreakDescription"
            label={formatMessage(strings.lawBreakDescription.label)}
            placeholder={formatMessage(strings.lawBreakDescription.label)}
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
            name="lawsBrokenDescription"
            label={formatMessage(strings.lawsBrokenDescription.label)}
            placeholder={formatMessage(strings.lawsBrokenDescription.label)}
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
