import React, { useMemo, useState, useCallback } from 'react'
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
import {
  IndictmentCount as TIndictmentCount,
  IndictmentCountOffense,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'

import { indictmentCount as strings } from './IndictmentCount.strings'
import { indictmentCountEnum as enumStrings } from './IndictmentCountEnum.strings'

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

const offenceLawsMap: Record<
  IndictmentCountOffense | 'DRUNK_DRIVING_MINOR' | 'DRUNK_DRIVING_MAJOR',
  [number, number][]
> = {
  [IndictmentCountOffense.DrivingWithoutLicence]: [[58, 1]],
  [IndictmentCountOffense.DrunkDriving]: [[49, 1]],
  DRUNK_DRIVING_MINOR: [[49, 2]],
  DRUNK_DRIVING_MAJOR: [[49, 3]],
  [IndictmentCountOffense.IllegalDrugsDriving]: [
    [50, 1],
    [50, 2],
  ],
  [IndictmentCountOffense.PrescriptionDrugsDriving]: [
    [48, 1],
    [48, 2],
  ],
}
const generalLaws: [number, number][] = [[95, 1]]

function lawsCompare(law1: number[], law2: number[]) {
  if (law1[0] < law2[0]) {
    return -1
  }
  if (law1[0] > law2[0]) {
    return 1
  }
  if (law1[1] < law2[1]) {
    return -1
  }
  if (law1[1] > law2[1]) {
    return 1
  }
  return 0
}

const laws = Object.values(offenceLawsMap)
  .flat()
  .concat(generalLaws)
  .sort(lawsCompare)

function getLawsBroken(offences: IndictmentCountOffense[]) {
  if (!offences || offences.length === 0) {
    return []
  }

  let lawsBroken: [number, number][] = []

  offences.forEach((offence) => {
    lawsBroken = lawsBroken.concat(offenceLawsMap[offence])

    if (offence === IndictmentCountOffense.DrunkDriving) {
      lawsBroken = lawsBroken.concat(offenceLawsMap['DRUNK_DRIVING_MINOR'])
    }
  })

  return lawsBroken.concat(generalLaws).sort(lawsCompare)
}

interface LawsBrokenOption {
  label: string
  value: string
  law: [number, number]
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
  const [
    legalArgumentsErrorMessage,
    setLegalArgumentsErrorMessage,
  ] = useState<string>('')

  function todoHandle(index: number) {
    //(index, 'todo')
  }

  const offensesList = useMemo(
    () =>
      Object.values(IndictmentCountOffense).map((offense) => ({
        value: offense,
        label: formatMessage(enumStrings[offense]),
        disabled: indictmentCount.offenses?.includes(offense),
      })),
    [formatMessage, indictmentCount.offenses],
  )

  const lawTag = useCallback(
    (law: number[]) =>
      formatMessage(strings.lawsBrokenTag, {
        paragraph: law[1],
        article: law[0],
      }),
    [formatMessage],
  )

  const lawsBrokenOptions: LawsBrokenOption[] = useMemo(
    () =>
      laws.map((law, index) => ({
        label: lawTag(law),
        value: `${index}`,
        law,
        disabled: Boolean(
          indictmentCount.lawsBroken?.find(
            (brokenLaw) => brokenLaw[0] === law[0] && brokenLaw[1] === law[1],
          ),
        ),
      })),
    [lawTag, indictmentCount.lawsBroken],
  )

  const legalArguments = useCallback(
    (lawsBroken?: number[][] | null) => {
      if (!lawsBroken || lawsBroken.length === 0) {
        return ''
      }

      let articles = `${lawsBroken[0][1]}.`

      for (let i = 1; i < lawsBroken.length; i++) {
        if (lawsBroken[i][0] !== lawsBroken[i - 1][0]) {
          articles = `${articles} mgr. ${lawsBroken[i - 1][0]}. gr.`
        }

        articles = `${articles}, sbr. ${lawsBroken[i][1]}.`
      }

      return formatMessage(strings.legalArgumentsAutofill, {
        articles: `${articles} mgr. ${
          lawsBroken[lawsBroken.length - 1][0]
        }. gr.`,
      })
    },
    [formatMessage],
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
      <Box marginBottom={2}>
        <Select
          name="offenses"
          options={offensesList}
          label={formatMessage(strings.incidentLabel)}
          placeholder={formatMessage(strings.incidentPlaceholder)}
          onChange={(so: ValueType<ReactSelectOption>) => {
            const selectedOffense = (so as ReactSelectOption)
              .value as IndictmentCountOffense
            const offences = [
              ...(indictmentCount.offenses || []),
              selectedOffense,
            ]
            const lawsBroken = getLawsBroken(offences)
            onChange(indictmentCount.id, {
              offenses: offences,
              lawsBroken: lawsBroken,
              legalArguments: legalArguments(lawsBroken),
            })
          }}
          value={null}
          required
        />
      </Box>
      {indictmentCount.offenses && indictmentCount.offenses.length > 0 && (
        <Box marginBottom={2}>
          {indictmentCount.offenses.map((offense) => (
            <Box
              display="inlineBlock"
              key={`${indictmentCount.id}-${offense}`}
              component="span"
              marginBottom={1}
              marginRight={1}
            >
              <Tag
                variant="darkerBlue"
                onClick={() => {
                  const offences = (indictmentCount.offenses || []).filter(
                    (o) => o !== offense,
                  )
                  const lawsBroken = getLawsBroken(offences)
                  onChange(indictmentCount.id, {
                    offenses: offences,
                    lawsBroken: lawsBroken,
                    legalArguments: legalArguments(lawsBroken),
                  })
                }}
              >
                <Box display="flex" alignItems="center">
                  {formatMessage(enumStrings[offense])}
                  <Icon icon="close" size="small" />
                </Box>
              </Tag>
            </Box>
          ))}
        </Box>
      )}
      <Box marginBottom={2}>
        <Select
          name="lawsBroken"
          options={lawsBrokenOptions}
          label={formatMessage(strings.lawsBrokenLabel)}
          placeholder={formatMessage(strings.lawsBrokenPlaceholder)}
          value={null}
          onChange={(selectedOption: ValueType<ReactSelectOption>) => {
            const law = (selectedOption as LawsBrokenOption).law
            const lawsBroken = [
              ...(indictmentCount.lawsBroken || []),
              law,
            ].sort(lawsCompare)
            onChange(indictmentCount.id, {
              lawsBroken: lawsBroken,
              legalArguments: legalArguments(lawsBroken),
            })
          }}
          required
        />
      </Box>
      {indictmentCount.lawsBroken && indictmentCount.lawsBroken.length > 0 && (
        <Box marginBottom={2}>
          {indictmentCount.lawsBroken.map((brokenLaw) => (
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
                  const lawsBroken = (indictmentCount.lawsBroken || []).filter(
                    (b) => lawsCompare(b, brokenLaw) !== 0,
                  )
                  onChange(indictmentCount.id, {
                    lawsBroken: lawsBroken,
                    legalArguments: legalArguments(lawsBroken),
                  })
                }}
                aria-label={lawTag(brokenLaw)}
              >
                <Box display="flex" alignItems="center">
                  {lawTag(brokenLaw)}
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
            errorMessage={legalArgumentsErrorMessage}
            hasError={legalArgumentsErrorMessage !== ''}
            value={indictmentCount.legalArguments ?? ''}
            onChange={(event) => {
              removeErrorMessageIfValid(
                ['empty'],
                event.target.value,
                legalArgumentsErrorMessage,
                setLegalArgumentsErrorMessage,
              )

              updateIndictmentCountState(
                indictmentCount.id,
                { legalArguments: event.target.value },
                setWorkingCase,
              )
            }}
            onBlur={(event) => {
              validateAndSetErrorMessage(
                ['empty'],
                event.target.value,
                setLegalArgumentsErrorMessage,
              )

              onChange(indictmentCount.id, {
                legalArguments: event.target.value.trim(),
              })
            }}
            autoComplete="off"
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
