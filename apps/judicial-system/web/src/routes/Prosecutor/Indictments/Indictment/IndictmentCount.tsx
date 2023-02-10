import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'
import InputMask from 'react-input-mask'

import {
  Box,
  Input,
  Select,
  Button,
  Tag,
  Icon,
} from '@island.is/island-ui/core'
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

const laws = [
  [48, 1], // lyf
  [48, 2], // lyf
  [49, 1], // ölvun
  [49, 2], // ölvun
  [49, 3], // ölvun
  [50, 1], // fíkniefni
  [50, 2], // fíkniefni
  [58, 1], // sviptingarakstur
  [95, 1], // á alltaf við öll þessi brot,
]

function lawLabel(law: number[]): string {
  return `${law[0]}. mgr. ${law[1]}. gr. 77/2019`
}

interface LawsBrokenOption {
  label: string
  value: string
  index: number
  disabled: boolean
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

  const lawsBrokenOptions: LawsBrokenOption[] = useMemo(
    () =>
      laws.map((law, index) => ({
        label: lawLabel(law),
        value: `${index}`,
        index: index,
        disabled: Boolean(
          indictmentCount.lawsBroken?.find(
            (brokenLaw) => brokenLaw[0] === law[0] && brokenLaw[1] === law[1],
          ),
        ),
      })),
    [indictmentCount.lawsBroken],
  )

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
          name="lawsBroken"
          options={lawsBrokenOptions}
          label={formatMessage(strings.lawsBrokenLabel)}
          placeholder={formatMessage(strings.lawsBrokenPlaceholder)}
          value={null}
          onChange={(selectedOption: ValueType<ReactSelectOption>) => {
            const index = (selectedOption as LawsBrokenOption).index
            onChange(indictmentCount.id, {
              lawsBroken: [...(indictmentCount.lawsBroken ?? []), laws[index]],
            })
          }}
          isCreatable
        />
      </Box>
      {indictmentCount.lawsBroken && indictmentCount.lawsBroken.length > 0 && (
        <Box marginBottom={2}>
          {indictmentCount.lawsBroken.map((brokenLaw, index) => (
            <Box
              display="inlineBlock"
              key={`${indictmentCount.id}-${brokenLaw}`}
              component="span"
              marginBottom={1}
              marginRight={1}
            >
              <Tag
                variant="darkerBlue"
                onClick={() => {
                  if (indictmentCount.lawsBroken) {
                    onChange(indictmentCount.id, {
                      lawsBroken: indictmentCount.lawsBroken
                        .slice(0, index)
                        .concat(indictmentCount.lawsBroken.slice(index + 1)),
                    })
                  }
                }}
                aria-label={lawLabel(brokenLaw)}
              >
                <Box display="flex" alignItems="center">
                  {lawLabel(brokenLaw)}
                  <Icon icon="close" size="small" />
                </Box>
              </Tag>
            </Box>
          ))}
        </Box>
      )}
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
            name="legalArguments"
            label={formatMessage(strings.legalArgumentsLabel)}
            placeholder={formatMessage(strings.legalArgumentsPlaceholder)}
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
