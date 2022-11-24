import React, { useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'
import InputMask from 'react-input-mask'

import {
  Box,
  Button,
  Icon,
  Input,
  Select,
  Tag,
} from '@island.is/island-ui/core'
import { CrimeScene, IndictmentSubtype } from '@island.is/judicial-system/types'
import {
  capitalize,
  indictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  BlueBox,
  DateTime,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'

import { policeCaseInfo } from './PoliceCaseInfo.strings'

interface Props {
  index: number
  policeCaseNumbers: string[]
  subtypes?: IndictmentSubtype[]
  crimeScene?: CrimeScene
  setPoliceCase: (
    index: number,
    update: {
      policeCaseNumber?: string
      subtypes?: IndictmentSubtype[]
      crimeScene?: CrimeScene
    },
  ) => void
  deletePoliceCase?: (index: number) => void
  updatePoliceCases: (
    index?: number,
    update?: {
      policeCaseNumber?: string
      subtypes?: IndictmentSubtype[]
      crimeScene?: CrimeScene
    },
  ) => void
}

export const PoliceCaseInfo: React.FC<Props> = (props) => {
  const {
    index,
    policeCaseNumbers,
    subtypes,
    crimeScene,
    setPoliceCase,
    deletePoliceCase,
    updatePoliceCases,
  } = props

  const { formatMessage } = useIntl()

  const { user } = useContext(UserContext)

  const [policeCaseNumberInput, setPoliceCaseNumberInput] = useState(
    policeCaseNumbers[index],
  )
  const [
    policeCaseNumberErrorMessage,
    setPoliceCaseNumberErrorMessage,
  ] = useState<string>('')

  const options = useMemo(
    () =>
      Object.values(IndictmentSubtype)
        .map((subtype) => ({
          label: capitalize(indictmentSubtypes[subtype]),
          value: subtype,
          disabled: subtypes?.includes(subtype),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [subtypes],
  )

  return (
    <BlueBox>
      {deletePoliceCase && (
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button
            onClick={() => deletePoliceCase(index)}
            colorScheme="destructive"
            variant="text"
            size="small"
            data-testid="deleteDefendantButton"
          >
            {formatMessage(policeCaseInfo.delete)}
          </Button>
        </Box>
      )}
      <Box marginBottom={2}>
        <InputMask
          mask={'999-9999-9999999'}
          maskPlaceholder={null}
          value={policeCaseNumberInput}
          onChange={(event) => {
            if (
              policeCaseNumbers.some(
                (policeCaseNumber, idx) =>
                  idx !== index && policeCaseNumber === event.target.value,
              )
            ) {
              setPoliceCaseNumberErrorMessage(
                formatMessage(policeCaseInfo.policeCaseNumberExists),
              )
            } else {
              removeErrorMessageIfValid(
                ['empty', 'police-casenumber-format'],
                event.target.value,
                policeCaseNumberErrorMessage,
                setPoliceCaseNumberErrorMessage,
              )
              setPoliceCase(index, {
                policeCaseNumber: event.target.value,
              })
            }
            setPoliceCaseNumberInput(event.target.value)
          }}
          onBlur={(event) => {
            validateAndSetErrorMessage(
              ['empty', 'police-casenumber-format'],
              event.target.value,
              setPoliceCaseNumberErrorMessage,
            )
            updatePoliceCases()
          }}
        >
          <Input
            name="policeCaseNumber"
            autoComplete="off"
            label={formatMessage(policeCaseInfo.policeCaseNumberLabel)}
            placeholder={formatMessage(
              policeCaseInfo.policeCaseNumberPlaceholder,
              {
                prefix: user?.institution?.policeCaseNumberPrefix ?? '',
                year: new Date().getFullYear(),
              },
            )}
            hasError={policeCaseNumberErrorMessage !== ''}
            errorMessage={policeCaseNumberErrorMessage}
            required
          />
        </InputMask>
      </Box>
      <Box marginBottom={2}>
        <Select
          name="case-type"
          options={options}
          label={formatMessage(policeCaseInfo.indictmentTypeLabel)}
          placeholder={formatMessage(policeCaseInfo.indictmentTypePlaceholder)}
          onChange={(selectedOption: ValueType<ReactSelectOption>) => {
            const indictmentSubtype = (selectedOption as ReactSelectOption)
              .value as IndictmentSubtype
            updatePoliceCases(index, {
              subtypes: [...(subtypes || []), indictmentSubtype],
            })
          }}
          value={
            subtypes && subtypes.length > 0
              ? {
                  value: subtypes[0],
                  label: capitalize(indictmentSubtypes[subtypes[0]]),
                }
              : null
          }
          required
        />
      </Box>
      {subtypes && (
        <Box marginBottom={2}>
          {subtypes.map((subtype, i) => (
            <Box
              key={`${policeCaseNumbers[index]}-${subtype}`}
              component="span"
              marginBottom={1}
              marginLeft={i === 0 ? 0 : 1}
            >
              <Tag
                variant="darkerBlue"
                onClick={() => {
                  updatePoliceCases(index, {
                    subtypes: subtypes.filter((s) => s !== subtype),
                  })
                }}
                aria-label={formatMessage(policeCaseInfo.removeSubtype, {
                  subtype: indictmentSubtypes[subtypes[0]],
                })}
              >
                <Box display="flex" alignItems="center">
                  {capitalize(indictmentSubtypes[subtype])}
                  <Icon icon="close" size="small" />
                </Box>
              </Tag>
            </Box>
          ))}
        </Box>
      )}
      <Box marginBottom={2}>
        <Input
          name="policeCasePlace"
          autoComplete="off"
          label={formatMessage(policeCaseInfo.policeCasePlaceLabel)}
          placeholder={formatMessage(policeCaseInfo.policeCasePlacePlaceholder)}
          value={crimeScene?.place ?? ''}
          onChange={(event) => {
            setPoliceCase(index, {
              crimeScene: { ...crimeScene, place: event.target.value },
            })
          }}
          onBlur={() => {
            updatePoliceCases()
          }}
        />
      </Box>
      <DateTime
        name="arrestDate"
        maxDate={new Date()}
        blueBox={false}
        selectedDate={crimeScene?.date}
        ignoreTime={true}
        onChange={(date, valid) => {
          if (date && valid)
            updatePoliceCases(index, {
              crimeScene: { ...crimeScene, date: date },
            })
        }}
      />
    </BlueBox>
  )
}
