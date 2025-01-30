import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import InputMask from 'react-input-mask'
import { IntlShape, useIntl } from 'react-intl'

import {
  Box,
  Button,
  Checkbox,
  Icon,
  Input,
  Select,
  Tag,
} from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  indictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import {
  CrimeScene,
  IndictmentSubtype,
  isTrafficViolationCase,
  offenseSubstances,
  Substance,
  SubstanceMap,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  IndictmentInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TempCase as Case,
  TempIndictmentCount as TIndictmentCount,
} from '@island.is/judicial-system-web/src/types'
import {
  isTrafficViolationIndictmentCount,
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  UpdateIndictmentCount,
  useIndictmentCounts,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { Substances as SubstanceChoices } from './Substances/Substances'
import { indictmentCount as strings } from './IndictmentCount.strings'
import { indictmentCountEnum as enumStrings } from './IndictmentCountEnum.strings'
import { indictmentCountSubstanceEnum as substanceStrings } from './IndictmentCountSubstanceEnum.strings'
import * as styles from './IndictmentCount.css'

interface Props {
  indictmentCount: TIndictmentCount
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  onChange: (
    indictmentCountId: string,
    updatedIndictmentCount: UpdateIndictmentCount,
  ) => void
  onDelete?: (indictmentCountId: string) => Promise<void>
  updateIndictmentCountState: (
    indictmentCountId: string,
    update: UpdateIndictmentCount,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => void
}

const offensesCompare = (
  offense1: IndictmentCountOffense,
  offense2: IndictmentCountOffense,
) => {
  const offense1Index = Object.values(IndictmentCountOffense).indexOf(offense1)
  const offense2Index = Object.values(IndictmentCountOffense).indexOf(offense2)

  if (offense1Index < offense2Index) {
    return -1
  }
  if (offense1Index > offense2Index) {
    return 1
  }
  return 0
}

/**
 * Indicates what laws are broken for each offence. The first number is
 * the paragraph and the second is the article, i.e. [49, 2] means paragraph
 * 49, article 2. If article is set to 0, that means that an article is
 * not specified.
 */
const offenseLawsMap: Record<
  IndictmentCountOffense | 'DRUNK_DRIVING_MINOR' | 'DRUNK_DRIVING_MAJOR',
  [number, number][]
> = {
  [IndictmentCountOffense.DRIVING_WITHOUT_LICENCE]: [[58, 1]],
  [IndictmentCountOffense.DRUNK_DRIVING]: [[49, 1]],
  DRUNK_DRIVING_MINOR: [[49, 2]],
  DRUNK_DRIVING_MAJOR: [[49, 3]],
  [IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING]: [
    [50, 1],
    [50, 2],
  ],
  [IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING]: [
    [48, 1],
    [48, 2],
  ],
  [IndictmentCountOffense.SPEEDING]: [[37, 0]],
}

const generalLaws: [number, number][] = [[95, 1]]

const lawsCompare = (law1: number[], law2: number[]) => {
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

const laws = Object.values(offenseLawsMap)
  .flat()
  .concat(generalLaws)
  .sort(lawsCompare)

const getLawsBroken = (
  offenses?: IndictmentCountOffense[] | null,
  substances?: SubstanceMap | null,
) => {
  if (!offenses || offenses.length === 0) {
    return []
  }

  let lawsBroken: [number, number][] = []

  offenses.forEach((offense) => {
    lawsBroken = lawsBroken.concat(offenseLawsMap[offense])

    if (offense === IndictmentCountOffense.DRUNK_DRIVING) {
      lawsBroken = lawsBroken.concat(
        ((substances && substances.ALCOHOL) || '') >= '1,20'
          ? offenseLawsMap.DRUNK_DRIVING_MAJOR
          : offenseLawsMap.DRUNK_DRIVING_MINOR,
      )
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

export const getRelevantSubstances = (
  offenses: IndictmentCountOffense[],
  substances: SubstanceMap,
) => {
  const allowedSubstances = offenses.map(
    (offense) => offenseSubstances[offense],
  )

  const relevantSubstances = allowedSubstances
    .map((allowedSubstance) => {
      return Object.entries(substances).filter((substance) => {
        return allowedSubstance.includes(substance[0] as Substance)
      })
    })
    .flat()
  return relevantSubstances
}

export const getIncidentDescriptionReason = (
  offenses: IndictmentCountOffense[],
  substances: SubstanceMap,
  formatMessage: IntlShape['formatMessage'],
) => {
  let reason = offenses.reduce((acc, offense, index) => {
    if (
      (offenses.length > 1 && index === offenses.length - 1) ||
      (offenses.length > 2 &&
        index === offenses.length - 2 &&
        offense === IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING)
    ) {
      acc += ' og '
    } else if (index > 0) {
      acc += ', '
    }
    switch (offense) {
      case IndictmentCountOffense.DRIVING_WITHOUT_LICENCE:
        acc += formatMessage(
          strings.incidentDescriptionDrivingWithoutLicenceAutofill,
        )
        break
      case IndictmentCountOffense.DRUNK_DRIVING:
        acc += formatMessage(strings.incidentDescriptionDrunkDrivingAutofill)
        break
      case IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING:
        acc += `${formatMessage(
          strings.incidentDescriptionDrugsDrivingPrefixAutofill,
        )} ${formatMessage(
          strings.incidentDescriptionIllegalDrugsDrivingAutofill,
        )}`
        break
      case IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING:
        acc +=
          (offenses.includes(IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING)
            ? ''
            : `${formatMessage(
                strings.incidentDescriptionDrugsDrivingPrefixAutofill,
              )} `) +
          formatMessage(
            strings.incidentDescriptionPrescriptionDrugsDrivingAutofill,
          )
        break
    }
    return acc
  }, '')

  const relevantSubstances = getRelevantSubstances(offenses, substances)

  reason += relevantSubstances.reduce((acc, substance, index) => {
    if (index === 0) {
      acc += ` (${formatMessage(
        strings.incidentDescriptionSubstancesPrefixAutofill,
      )} `
    } else if (index === relevantSubstances.length - 1) {
      acc += ' og '
    } else {
      acc += ', '
    }
    acc += formatMessage(substanceStrings[substance[0] as Substance], {
      amount: substance[1],
    })
    if (index === relevantSubstances.length - 1) {
      acc += ')'
    }
    return acc
  }, '')

  return reason
}

export const getLegalArguments = (
  lawsBroken: number[][],
  formatMessage: IntlShape['formatMessage'],
) => {
  if (lawsBroken.length === 0) {
    return ''
  }

  const relevantLaws =
    lawsCompare(lawsBroken[lawsBroken.length - 1], generalLaws[0]) === 0
      ? lawsBroken.slice(0, -1)
      : lawsBroken
  let andIndex = -1
  if (relevantLaws.length > 1) {
    for (let i = relevantLaws.length - 1; i > 0; i--) {
      if (relevantLaws[i - 1][0] !== relevantLaws[i][0]) {
        andIndex = i
        break
      }
    }
  }

  let articles = `${lawsBroken[0][1]}.`
  const noArticle = articles === '0.'

  for (let i = 1; i < lawsBroken.length; i++) {
    let useSbr = true

    if (lawsBroken[i][0] !== lawsBroken[i - 1][0]) {
      articles = `${noArticle ? '' : `${articles} mgr. `}${
        lawsBroken[i - 1][0]
      }. gr.`
      useSbr = i > andIndex
    }

    articles = `${articles}${
      i === andIndex ? ' og' : useSbr ? ', sbr.' : ','
    } ${lawsBroken[i][1]}.`
  }

  return formatMessage(strings.legalArgumentsAutofill, {
    articles: `${articles} mgr. ${lawsBroken[lawsBroken.length - 1][0]}. gr.`,
  })
}

export const getIncidentDescription = (
  indictmentCount: TIndictmentCount,
  formatMessage: IntlShape['formatMessage'],
  crimeScene?: CrimeScene,
  subtypesRecord?: Record<string, IndictmentSubtype[]>,
) => {
  const {
    offenses,
    substances,
    vehicleRegistrationNumber,
    indictmentCountSubtypes,
    policeCaseNumber,
  } = indictmentCount

  const incidentLocation = crimeScene?.place || '[Vettvangur]'
  const incidentDate = crimeScene?.date
    ? formatDate(crimeScene.date, 'PPPP')?.replace('dagur,', 'daginn') || ''
    : '[Dagsetning]'

  const vehicleRegistration =
    vehicleRegistrationNumber || '[Skráningarnúmer ökutækis]'

  const subtypes =
    (subtypesRecord && policeCaseNumber && subtypesRecord[policeCaseNumber]) ||
    []

  if (
    subtypes.length === 0 ||
    (subtypes.length > 1 &&
      (!indictmentCountSubtypes?.length ||
        indictmentCountSubtypes.length === 0))
  ) {
    return ''
  }

  if (
    isTrafficViolationIndictmentCount(policeCaseNumber, subtypesRecord) ||
    indictmentCountSubtypes?.includes(IndictmentSubtype.TRAFFIC_VIOLATION)
  ) {
    if (!offenses || offenses.length === 0) {
      return ''
    }

    const reason = getIncidentDescriptionReason(
      offenses,
      substances || {},
      formatMessage,
    )

    const isSpeeding = indictmentCount.offenses?.includes(
      IndictmentCountOffense.SPEEDING,
    )

    const recordedSpeed = indictmentCount.recordedSpeed ?? '[Mældur hraði]'
    const speedLimit = indictmentCount.speedLimit ?? '[Leyfilegur hraði]'

    return formatMessage(strings.incidentDescriptionAutofill, {
      incidentDate,
      vehicleRegistrationNumber: vehicleRegistration,
      reason,
      incidentLocation,
      isSpeeding,
      recordedSpeed,
      speedLimit,
    })
  }

  if (subtypes.length === 1) {
    return formatMessage(strings.indictmentDescriptionSubtypesAutofill, {
      subtypes: indictmentSubtypes[subtypes[0]],
      date: incidentDate,
    })
  }

  const allSubtypes = indictmentCountSubtypes
    ?.map((subtype) => indictmentSubtypes[subtype])
    .join(', ')

  return formatMessage(strings.indictmentDescriptionSubtypesAutofill, {
    subtypes: allSubtypes,
    date: incidentDate,
  })
}

export const IndictmentCount: FC<Props> = ({
  indictmentCount,
  workingCase,
  onChange,
  onDelete,
  updateIndictmentCountState,
  setWorkingCase,
}) => {
  const { formatMessage } = useIntl()
  const { lawTag } = useIndictmentCounts()

  const [
    vehicleRegistrationNumberErrorMessage,
    setVehicleRegistrationNumberErrorMessage,
  ] = useState<string>('')
  const [incidentDescriptionErrorMessage, setIncidentDescriptionErrorMessage] =
    useState<string>('')
  const [bloodAlcoholContentErrorMessage, setBloodAlcoholContentErrorMessage] =
    useState<string>('')
  const [legalArgumentsErrorMessage, setLegalArgumentsErrorMessage] =
    useState<string>('')
  const [recordedSpeedErrorMessage, setRecordedSpeedErrorMessage] =
    useState<string>('')
  const [speedLimitErrorMessage, setSpeedLimitErrorMessage] =
    useState<string>('')

  const subtypes: IndictmentSubtype[] = indictmentCount.policeCaseNumber
    ? workingCase.indictmentSubtypes[indictmentCount.policeCaseNumber]
    : []

  const offensesOptions = useMemo(
    () =>
      Object.values(IndictmentCountOffense).map((offense) => ({
        value: offense,
        label: formatMessage(enumStrings[offense]),
        disabled: indictmentCount.offenses?.includes(offense),
      })),
    [formatMessage, indictmentCount.offenses],
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

  const handleIndictmentCountChanges = (update: UpdateIndictmentCount) => {
    let lawsBroken

    if (update.substances || update.offenses) {
      lawsBroken = getLawsBroken(
        update.offenses || indictmentCount.offenses,
        update.substances || indictmentCount.substances,
      )
    }

    if (lawsBroken !== undefined) {
      update.lawsBroken = lawsBroken
      update.legalArguments = getLegalArguments(lawsBroken, formatMessage)
    }

    const policeCaseNumber =
      update.policeCaseNumber ?? indictmentCount.policeCaseNumber

    const crimeScene = policeCaseNumber
      ? workingCase.crimeScenes[policeCaseNumber]
      : undefined

    const incidentDescription = getIncidentDescription(
      {
        ...indictmentCount,
        ...update,
      },
      formatMessage,
      crimeScene,
      workingCase.indictmentSubtypes,
    )

    onChange(indictmentCount.id, {
      incidentDescription,
      ...update,
    })
  }

  const handleSubtypeChange = (
    subtype: IndictmentSubtype,
    checked: boolean,
  ) => {
    const currentSubtypes = new Set(
      indictmentCount.indictmentCountSubtypes ?? [],
    )

    checked ? currentSubtypes.add(subtype) : currentSubtypes.delete(subtype)

    handleIndictmentCountChanges({
      indictmentCountSubtypes: Array.from(currentSubtypes),
      ...(!currentSubtypes.has(IndictmentSubtype.TRAFFIC_VIOLATION) && {
        offenses: [],
        substances: {},
        vehicleRegistrationNumber: null,
      }),
    })
  }

  const shouldShowTrafficViolationFields = () => {
    if (isTrafficViolationCase(workingCase)) {
      return true
    }

    const policeCaseNumber = indictmentCount.policeCaseNumber

    if (
      isTrafficViolationIndictmentCount(
        policeCaseNumber,
        workingCase.indictmentSubtypes,
      )
    ) {
      return true
    }

    if (
      indictmentCount?.indictmentCountSubtypes?.includes(
        IndictmentSubtype.TRAFFIC_VIOLATION,
      )
    ) {
      return true
    }

    return false
  }

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
      <SectionHeading
        heading="h4"
        title={formatMessage(strings.policeCaseNumberTitle)}
        marginBottom={2}
      />
      <Box marginBottom={1}>
        <Select
          name="policeCaseNumber"
          options={workingCase.policeCaseNumbers?.map((val) => ({
            value: val,
            label: val,
          }))}
          label={formatMessage(strings.policeCaseNumberLabel)}
          placeholder={formatMessage(strings.policeCaseNumberPlaceholder)}
          onChange={async (so) => {
            const policeCaseNumber = so?.value

            handleIndictmentCountChanges({ policeCaseNumber })
          }}
          value={
            workingCase.policeCaseNumbers
              ?.map((val) => ({
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
        <Box marginBottom={3}>
          <IndictmentInfo
            policeCaseNumber={indictmentCount.policeCaseNumber ?? ''}
            subtypes={workingCase.indictmentSubtypes}
            crimeScenes={workingCase.crimeScenes}
          />
        </Box>
        {subtypes?.length > 1 && (
          <Box marginBottom={2}>
            <SectionHeading
              title={formatMessage(strings.selectIndictmentSubtype)}
              heading="h4"
              marginBottom={2}
            />
            <div className={styles.indictmentSubtypesContainter}>
              {subtypes.map((subtype: IndictmentSubtype) => (
                <div
                  className={styles.indictmentSubtypesItem}
                  key={`${subtype}-${indictmentCount.id}`}
                >
                  <Checkbox
                    name={`${subtype}-${indictmentCount.id}`}
                    value={subtype}
                    label={capitalize(indictmentSubtypes[subtype])}
                    checked={
                      indictmentCount.indictmentCountSubtypes?.includes(
                        subtype,
                      ) ?? false
                    }
                    onChange={(evt) => {
                      handleSubtypeChange(subtype, evt.target.checked)
                    }}
                    backgroundColor="white"
                    large
                    filled
                  />
                </div>
              ))}
            </div>
          </Box>
        )}
      </Box>
      {shouldShowTrafficViolationFields() && (
        <>
          <SectionHeading
            heading="h4"
            title={formatMessage(strings.vehicleRegistrationNumberTitle)}
            marginBottom={2}
          />
          <Box marginBottom={2}>
            <Input
              name="vehicleRegistrationNumber"
              autoComplete="off"
              label={formatMessage(strings.vehicleRegistrationNumberLabel)}
              placeholder={formatMessage(
                strings.vehicleRegistrationNumberPlaceholder,
              )}
              value={indictmentCount.vehicleRegistrationNumber ?? ''}
              onChange={(event) => {
                removeErrorMessageIfValid(
                  ['empty'],
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
                  ['empty'],
                  event.target.value,
                  setVehicleRegistrationNumberErrorMessage,
                )

                handleIndictmentCountChanges({
                  vehicleRegistrationNumber: event.target.value,
                })
              }}
              errorMessage={vehicleRegistrationNumberErrorMessage}
              hasError={vehicleRegistrationNumberErrorMessage !== ''}
              required
            />
          </Box>
          <Box marginBottom={2}>
            <SectionHeading
              heading="h4"
              title={formatMessage(strings.incidentTitle)}
              marginBottom={2}
            />
            <Select
              name="offenses"
              options={offensesOptions}
              label={formatMessage(strings.incidentLabel)}
              placeholder={formatMessage(strings.incidentPlaceholder)}
              onChange={(so) => {
                const selectedOffense = so?.value as IndictmentCountOffense
                const offenses = [
                  ...(indictmentCount.offenses ?? []),
                  selectedOffense,
                ].sort(offensesCompare)

                handleIndictmentCountChanges({
                  offenses,
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
                      const offenses = (indictmentCount.offenses ?? []).filter(
                        (o) => o !== offense,
                      )

                      offenseSubstances[offense].forEach((e) => {
                        if (indictmentCount.substances) {
                          delete indictmentCount.substances[e]
                        }
                      })

                      handleIndictmentCountChanges({
                        offenses,
                        substances: indictmentCount.substances,
                        ...(offense === IndictmentCountOffense.SPEEDING && {
                          recordedSpeed: null,
                          speedLimit: null,
                        }),
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
          {indictmentCount.offenses?.includes(
            IndictmentCountOffense.DRUNK_DRIVING,
          ) && (
            <Box marginBottom={2}>
              <SectionHeading
                title={formatMessage(strings.bloodAlcoholContentTitle)}
                heading="h4"
                marginBottom={2}
              />
              <InputMask
                mask={'9,99'}
                maskPlaceholder={null}
                value={indictmentCount.substances?.ALCOHOL ?? ''}
                onChange={(event) => {
                  removeErrorMessageIfValid(
                    ['empty'],
                    event.target.value,
                    bloodAlcoholContentErrorMessage,
                    setBloodAlcoholContentErrorMessage,
                  )

                  updateIndictmentCountState(
                    indictmentCount.id,
                    {
                      substances: {
                        ...indictmentCount.substances,
                        ALCOHOL: event.target.value,
                      },
                    },
                    setWorkingCase,
                  )
                }}
                onBlur={(event) => {
                  const value =
                    event.target.value.length > 0
                      ? `${event.target.value}${'0,00'.slice(
                          event.target.value.length,
                        )}`
                      : event.target.value

                  validateAndSetErrorMessage(
                    ['empty'],
                    value,
                    setBloodAlcoholContentErrorMessage,
                  )

                  const substances = {
                    ...indictmentCount.substances,
                    ALCOHOL: value,
                  }

                  handleIndictmentCountChanges({
                    substances,
                  })
                }}
              >
                <Input
                  name="alcohol"
                  autoComplete="off"
                  label={formatMessage(strings.bloodAlcoholContentLabel)}
                  placeholder={formatMessage(
                    strings.bloodAlcoholContentPlaceholder,
                  )}
                  errorMessage={bloodAlcoholContentErrorMessage}
                  hasError={bloodAlcoholContentErrorMessage !== ''}
                  required
                />
              </InputMask>
            </Box>
          )}
          {indictmentCount.offenses?.includes(
            IndictmentCountOffense.SPEEDING,
          ) && (
            <Box marginBottom={2}>
              <SectionHeading
                title={formatMessage(strings.speedingTitle)}
                heading="h4"
                marginBottom={2}
              />
              <Box marginBottom={1}>
                <InputMask
                  mask={'999'}
                  maskPlaceholder={null}
                  value={indictmentCount.recordedSpeed?.toString() ?? ''}
                  onChange={(event) => {
                    const recordedSpeed = parseInt(event.target.value)

                    removeErrorMessageIfValid(
                      ['empty'],
                      event.target.value,
                      recordedSpeedErrorMessage,
                      setRecordedSpeedErrorMessage,
                    )

                    updateIndictmentCountState(
                      indictmentCount.id,
                      { recordedSpeed },
                      setWorkingCase,
                    )
                  }}
                  onBlur={(event) => {
                    const recordedSpeed = parseInt(event.target.value)

                    if (Number.isNaN(recordedSpeed)) {
                      setRecordedSpeedErrorMessage('Reitur má ekki vera tómur')
                      return
                    }

                    handleIndictmentCountChanges({
                      recordedSpeed,
                    })
                  }}
                >
                  <Input
                    name="recordedSpeed"
                    autoComplete="off"
                    label={formatMessage(strings.recordedSpeedLabel)}
                    placeholder="0"
                    required
                    errorMessage={recordedSpeedErrorMessage}
                    hasError={recordedSpeedErrorMessage !== ''}
                  />
                </InputMask>
              </Box>
              <InputMask
                mask={'999'}
                maskPlaceholder={null}
                value={indictmentCount.speedLimit?.toString() ?? ''}
                onChange={(event) => {
                  const speedLimit = parseInt(event.target.value)

                  removeErrorMessageIfValid(
                    ['empty'],
                    event.target.value,
                    speedLimitErrorMessage,
                    setSpeedLimitErrorMessage,
                  )

                  updateIndictmentCountState(
                    indictmentCount.id,
                    { speedLimit },
                    setWorkingCase,
                  )
                }}
                onBlur={(event) => {
                  const speedLimit = parseInt(event.target.value)

                  if (Number.isNaN(speedLimit)) {
                    setSpeedLimitErrorMessage('Reitur má ekki vera tómur')
                    return
                  }

                  handleIndictmentCountChanges({
                    speedLimit,
                  })
                }}
              >
                <Input
                  name="speedLimit"
                  autoComplete="off"
                  label={formatMessage(strings.speedLimitLabel)}
                  placeholder="0"
                  required
                  errorMessage={speedLimitErrorMessage}
                  hasError={speedLimitErrorMessage !== ''}
                />
              </InputMask>
            </Box>
          )}
          {indictmentCount.offenses
            ?.filter(
              (offenseType) =>
                offenseType === IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING ||
                offenseType ===
                  IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
            )
            .map((offenseType) => (
              <Box key={`${indictmentCount.id}-${offenseType}-substances`}>
                <SubstanceChoices
                  indictmentCount={indictmentCount}
                  indictmentCountOffenseType={offenseType}
                  onChange={handleIndictmentCountChanges}
                />
              </Box>
            ))}
          <Box marginBottom={2}>
            <SectionHeading
              heading="h4"
              title={formatMessage(strings.lawsBrokenTitle)}
              marginBottom={2}
            />
            <Select
              name="lawsBroken"
              options={lawsBrokenOptions}
              label={formatMessage(strings.lawsBrokenLabel)}
              placeholder={formatMessage(strings.lawsBrokenPlaceholder)}
              value={null}
              onChange={(selectedOption) => {
                const law = (selectedOption as LawsBrokenOption).law
                const lawsBroken = [
                  ...(indictmentCount.lawsBroken ?? []),
                  law,
                ].sort(lawsCompare)

                onChange(indictmentCount.id, {
                  lawsBroken: lawsBroken,
                  legalArguments: getLegalArguments(lawsBroken, formatMessage),
                })

                handleIndictmentCountChanges({
                  lawsBroken,
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
                      const lawsBroken = (
                        indictmentCount.lawsBroken ?? []
                      ).filter((b) => lawsCompare(b, brokenLaw) !== 0)

                      onChange(indictmentCount.id, {
                        lawsBroken: lawsBroken,
                        legalArguments: getLegalArguments(
                          lawsBroken,
                          formatMessage,
                        ),
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
        </>
      )}
      <Box component="section" marginBottom={3}>
        <SectionHeading
          heading="h4"
          title={formatMessage(strings.incidentDescriptionTitle)}
          marginBottom={2}
        />
        <Box marginBottom={2}>
          <Input
            name="incidentDescription"
            autoComplete="off"
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
      <Box component="section">
        <SectionHeading
          heading="h4"
          title={formatMessage(strings.legalArgumentsTitle)}
          marginBottom={2}
        />

        <Input
          name="legalArguments"
          autoComplete="off"
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
          required
          rows={7}
          autoExpand={{ on: true, maxHeight: 600 }}
          textarea
        />
      </Box>
    </BlueBox>
  )
}
