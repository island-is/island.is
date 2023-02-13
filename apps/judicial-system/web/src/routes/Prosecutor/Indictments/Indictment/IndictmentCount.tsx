import React, { useCallback, useMemo, useState } from 'react'
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
import { formatDate } from '@island.is/judicial-system/formatters'
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
  const [
    incidentDescriptionErrorMessage,
    setIncidentDescriptionErrorMessage,
  ] = useState<string>('')
  const [
    legalArgumentsErrorMessage,
    setLegalArgumentsErrorMessage,
  ] = useState<string>('')

  const offensesList = Object.values(IndictmentCountOffense).map((offense) => ({
    value: offense,
    label: formatMessage(enumStrings[offense]),
    disabled: indictmentCount.offenses?.includes(offense),
  }))

  const lawTag = useCallback(
    (law: number[]): string =>
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
        index: index,
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

  const incidentDescription = useCallback(
    (
      offenses: IndictmentCountOffense[] | undefined,
      policeCaseNumber?: string,
      vehicleRegistrationNumber?: string,
    ) => {
      if (offenses === undefined) {
        return ''
      }

      let incidentLocation = ''
      let incidentDate = ''
      let incidentDescription = ''

      if (workingCase.crimeScenes && policeCaseNumber) {
        const crimeScenes = workingCase.crimeScenes
        const crimeDate = crimeScenes[policeCaseNumber].date

        incidentLocation = crimeScenes[policeCaseNumber].place ?? ''
        incidentDate =
          formatDate(crimeDate, 'PPPP')?.replace('dagur,', 'daginn') ?? ''
      }

      incidentDescription = offenses
        .map((offense, index, arr) => {
          return formatMessage(
            strings.trafficViolationIncidentDescriptionAutofill,
            {
              incidentDate: incidentDate ? incidentDate : '[Dagsetning]',
              vehicleRegistrationNumber: vehicleRegistrationNumber
                ? vehicleRegistrationNumber
                : '[Skráningarnúmer ökutækis]',
              offense: offense,
              incidentLocation: incidentLocation
                ? incidentLocation
                : '[Vettvangur]',
            },
          )
        })
        .join('\n\n')

      setIncidentDescriptionErrorMessage('')
      return incidentDescription
    },
    [formatMessage, workingCase.crimeScenes],
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
          onChange={async (so: ValueType<ReactSelectOption>) => {
            const policeCaseNumber = (so as ReactSelectOption).value as string

            onChange(indictmentCount.id, {
              policeCaseNumber: policeCaseNumber,
              incidentDescription: incidentDescription(
                indictmentCount.offenses ?? [],
                policeCaseNumber,
                indictmentCount.vehicleRegistrationNumber ?? '',
              ),
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
              incidentDescription: incidentDescription(
                indictmentCount.offenses ?? [],
                indictmentCount.policeCaseNumber ?? '',
                event.target.value,
              ),
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
            const offenses = [
              ...(indictmentCount.offenses || []),
              selectedOffense,
            ]
            onChange(indictmentCount.id, {
              offenses: offenses,
              incidentDescription: incidentDescription(
                offenses,
                indictmentCount.policeCaseNumber ?? '',
                indictmentCount.vehicleRegistrationNumber ?? '',
              ),
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
              key={`${offense}`}
              component="span"
              marginBottom={1}
              marginRight={1}
            >
              <Tag
                variant="darkerBlue"
                onClick={() => {
                  const offenses = indictmentCount.offenses?.filter(
                    (o) => o !== offense,
                  )
                  onChange(indictmentCount.id, {
                    offenses: offenses,
                    incidentDescription: incidentDescription(
                      offenses,
                      indictmentCount.policeCaseNumber ?? '',
                      indictmentCount.vehicleRegistrationNumber ?? '',
                    ),
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
            const index = (selectedOption as LawsBrokenOption).index
            const lawsBroken = [
              ...(indictmentCount.lawsBroken ?? []),
              laws[index],
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
                  if (!indictmentCount.lawsBroken) {
                    return
                  }

                  const lawsBroken = indictmentCount.lawsBroken
                    .slice(0, index)
                    .concat(indictmentCount.lawsBroken.slice(index + 1))
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
            errorMessage={incidentDescriptionErrorMessage}
            hasError={incidentDescriptionErrorMessage !== ''}
            value={indictmentCount.incidentDescription ?? ''}
            onChange={(event) => {
              removeErrorMessageIfValid(
                ['empty'],
                event.target.value,
                incidentDescriptionErrorMessage,
                setIncidentDescriptionErrorMessage,
              )

              updateIndictmentCountState(
                indictmentCount.id,
                { incidentDescription: event.target.value },
                setWorkingCase,
              )
            }}
            onBlur={(event) => {
              validateAndSetErrorMessage(
                ['empty'],
                event.target.value,
                setIncidentDescriptionErrorMessage,
              )

              onChange(indictmentCount.id, {
                incidentDescription: event.target.value.trim(),
              })
            }}
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
