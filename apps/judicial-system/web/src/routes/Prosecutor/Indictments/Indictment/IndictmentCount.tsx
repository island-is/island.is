import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
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
  indictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import {
  isTrafficViolationIndictmentCount,
  SubstanceMap,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  IndictmentInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  IndictmentCount as TIndictmentCount,
  IndictmentCountOffense,
  IndictmentSubtype,
  Offense,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  UpdateIndictmentCount,
  useLawTag,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { getDefaultDefendantGender } from '@island.is/judicial-system-web/src/utils/utils'

import { getIncidentDescription } from './lib/getIncidentDescription'
import { Offenses } from './Offenses/Offenses'
import { strings } from './IndictmentCount.strings'
import * as styles from './IndictmentCount.css'

interface Props {
  indictmentCount: TIndictmentCount
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  onChange: (
    indictmentCountId: string,
    updatedIndictmentCount: UpdateIndictmentCount,
    updatedOffenses?: Offense[],
  ) => void
  onDelete?: (indictmentCountId: string) => Promise<void>
  updateIndictmentCountState: (
    indictmentCountId: string,
    update: UpdateIndictmentCount,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
    updatedOffenses?: Offense[],
  ) => void
}

type Law = [number, number]

const driversLicenceLaws: Law[] = [[58, 1]]
const generalLaws: Law[] = [[95, 1]]

/**
 * Indicates what laws are broken for each offense. The first number is
 * the paragraph and the second is the article, i.e. [49, 2] means paragraph
 * 49, article 2. If article is set to 0, that means that an article is
 * not specified.
 */
const offenseLawsMap: Record<
  IndictmentCountOffense | 'DRUNK_DRIVING_MINOR' | 'DRUNK_DRIVING_MAJOR',
  Law[]
> = {
  [IndictmentCountOffense.DRIVING_WITHOUT_LICENCE]: driversLicenceLaws,
  [IndictmentCountOffense.DRIVING_WITHOUT_VALID_LICENSE]: driversLicenceLaws,
  [IndictmentCountOffense.DRIVING_WITHOUT_EVER_HAVING_LICENSE]:
    driversLicenceLaws,
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
  [IndictmentCountOffense.OTHER]: [],
}

const lawsCompare = (law1: Law, law2: Law) => {
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

// Law tuple values are reference types,
// so we need to be careful when constructing the lists passed to getUniqueSortedLaws
const getUniqueSortedLaws = (laws: Law[]) => {
  return [...new Set(laws)].sort(lawsCompare)
}

const laws = getUniqueSortedLaws(
  Object.values(offenseLawsMap).flat().concat(generalLaws),
)

const getLawsBroken = (
  offenses?: IndictmentCountOffense[] | null,
  substances?: SubstanceMap | null,
) => {
  const hasOffenses = isNonEmptyArray(offenses)
  const hasOnlyOtherOffense =
    offenses?.length === 1 && offenses[0] === IndictmentCountOffense.OTHER

  if (!hasOffenses || hasOnlyOtherOffense) {
    return []
  }

  const lawsBroken: Law[] = []

  offenses.forEach((offense) => {
    lawsBroken.push(...offenseLawsMap[offense])

    if (offense === IndictmentCountOffense.DRUNK_DRIVING) {
      lawsBroken.push(
        ...(((substances && substances.ALCOHOL) || '') >= '1,20'
          ? offenseLawsMap.DRUNK_DRIVING_MAJOR
          : offenseLawsMap.DRUNK_DRIVING_MINOR),
      )
    }
  })

  lawsBroken.push(...generalLaws)

  return getUniqueSortedLaws(lawsBroken)
}

interface LawsBrokenOption {
  label: string
  value: string
  law: Law
  disabled: boolean
}

export const getLegalArguments = (
  lawsBroken: number[][],
  formatMessage: IntlShape['formatMessage'],
) => {
  if (lawsBroken.length === 0) {
    return ''
  }

  const relevantLaws =
    lawsCompare(lawsBroken[lawsBroken.length - 1] as Law, generalLaws[0]) === 0
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

  // handle the sub-article of the first laws tuple
  let articles = lawsBroken[0][1] === 0 ? '' : `${lawsBroken[0][1]}.`

  for (let i = 1; i < lawsBroken.length; i++) {
    let useSbr = true
    const hasNoArticle = lawsBroken[i - 1][1] === 0

    if (lawsBroken[i][0] !== lawsBroken[i - 1][0]) {
      articles = `${articles}${hasNoArticle ? '' : ` mgr. `}${
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

export const IndictmentCount: FC<Props> = ({
  indictmentCount,
  workingCase,
  onChange,
  onDelete,
  updateIndictmentCountState,
  setWorkingCase,
}) => {
  const { formatMessage } = useIntl()
  const lawTag = useLawTag()

  const gender = getDefaultDefendantGender(workingCase.defendants)

  const [
    vehicleRegistrationNumberErrorMessage,
    setVehicleRegistrationNumberErrorMessage,
  ] = useState<string>('')
  const [incidentDescriptionErrorMessage, setIncidentDescriptionErrorMessage] =
    useState<string>('')
  const [legalArgumentsErrorMessage, setLegalArgumentsErrorMessage] =
    useState<string>('')

  const subtypes: IndictmentSubtype[] = indictmentCount.policeCaseNumber
    ? workingCase.indictmentSubtypes[indictmentCount.policeCaseNumber]
    : []

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

  const showLegalArticleSelection = indictmentCount.offenses?.some(
    ({ offense }) => offense !== IndictmentCountOffense.OTHER,
  )

  const handleIndictmentCountChanges = (
    update: UpdateIndictmentCount,
    updatedOffenses?: Offense[],
  ) => {
    let lawsBroken

    if (updatedOffenses) {
      const offenses = updatedOffenses?.map((o) => o.offense)
      const substances = updatedOffenses?.reduce(
        (res, offense) => Object.assign(res, offense.substances),
        {} as SubstanceMap,
      )

      lawsBroken = getLawsBroken(offenses, substances)
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
        ...(updatedOffenses ? { offenses: updatedOffenses } : {}),
      },
      gender,
      crimeScene,
      formatMessage,
      workingCase.indictmentSubtypes,
    )

    onChange(
      indictmentCount.id,
      {
        incidentDescription,
        ...update,
      },
      updatedOffenses,
    )
  }

  const handleSubtypeChange = (
    subtype: IndictmentSubtype,
    checked: boolean,
  ) => {
    const currentSubtypes = new Set(
      indictmentCount.indictmentCountSubtypes ?? [],
    )

    checked ? currentSubtypes.add(subtype) : currentSubtypes.delete(subtype)

    const hasTrafficViolationSubType = currentSubtypes.has(
      IndictmentSubtype.TRAFFIC_VIOLATION,
    )
    if (!hasTrafficViolationSubType) {
      handleIndictmentCountChanges(
        {
          indictmentCountSubtypes: Array.from(currentSubtypes),
          vehicleRegistrationNumber: null,
          recordedSpeed: null,
          speedLimit: null,
        },
        [],
      )
    } else {
      handleIndictmentCountChanges({
        indictmentCountSubtypes: Array.from(currentSubtypes),
      })
    }
  }

  const shouldShowTrafficViolationFields = isTrafficViolationIndictmentCount(
    indictmentCount.indictmentCountSubtypes,
    subtypes,
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
      {shouldShowTrafficViolationFields && (
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
          <Offenses
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            indictmentCount={indictmentCount}
            updateIndictmentCountState={updateIndictmentCountState}
            handleIndictmentCountChanges={handleIndictmentCountChanges}
          />
          {showLegalArticleSelection && (
            <>
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
                    const lawsBroken = getUniqueSortedLaws([
                      ...((indictmentCount.lawsBroken ?? []) as Law[]),
                      law,
                    ])

                    onChange(indictmentCount.id, {
                      lawsBroken: lawsBroken,
                      legalArguments: getLegalArguments(
                        lawsBroken,
                        formatMessage,
                      ),
                    })

                    handleIndictmentCountChanges({
                      lawsBroken,
                    })
                  }}
                  required
                />
              </Box>
              {indictmentCount.lawsBroken &&
                indictmentCount.lawsBroken.length > 0 && (
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
                            ).filter(
                              (b) =>
                                lawsCompare(b as Law, brokenLaw as Law) !== 0,
                            )

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
