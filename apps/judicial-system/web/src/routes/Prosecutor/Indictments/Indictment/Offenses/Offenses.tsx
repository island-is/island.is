import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import { Box, Icon, Input, Select, Tag } from '@island.is/island-ui/core'
import {
  IndictmentCountOffense,
  SubstanceMap,
} from '@island.is/judicial-system/types'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  Offense,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempIndictmentCount } from '@island.is/judicial-system-web/src/types'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks'
import useOffenses from '@island.is/judicial-system-web/src/utils/hooks/useOffenses'

import { Substances } from '../Substances/Substances'
import { SpeedingOffenseFields } from './SpeedingOffenseFields'
import { indictmentCount as strings } from '../IndictmentCount.strings'
import { indictmentCountEnum as enumStrings } from '../IndictmentCountEnum.strings'

// when migrating offenses to the new structure they will all have the same creation date, thus we fallback to compare 
// and sort by the offense type
const offensesCompare = (
  o1: Offense, o2: Offense
) => {
  const offense1Index = Object.values(IndictmentCountOffense).indexOf(o1.offense)
  const offense2Index = Object.values(IndictmentCountOffense).indexOf(o2.offense)

  if (offense1Index < offense2Index) {
    return -1
  }
  if (offense1Index > offense2Index) {
    return 1
  }
  return 0
}

const sortByCreatedDate = (o1: Offense, o2: Offense) => {
  if (!(o1.created && o2.created)) {
    return 0
  }
  if (o1.created < o2.created) {
    return -1
  }
  if (o1.created > o2.created) {
    return 1
  }
  return offensesCompare(o1, o2)
}

const getUpdatedOffenses = (
  currentOffenses: Offense[],
  updatedOffense: Offense,
) =>
  [
    ...currentOffenses.filter((o) => o.id !== updatedOffense.id),
    updatedOffense,
  ].sort(sortByCreatedDate)

const getDrunkDriving = (offenses: Offense[]) =>
  offenses.find((o) => o.offense === IndictmentCountOffense.DRUNK_DRIVING)

const getSpeeding = (offenses: Offense[]) =>
  offenses.find((o) => o.offense === IndictmentCountOffense.SPEEDING)

const getDrugsDriving = (offenses: Offense[]) =>
  offenses?.filter(
    (o) =>
      o.offense === IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING ||
      o.offense === IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
  )

export const Offenses = ({
  workingCase,
  setWorkingCase,
  indictmentCount,
  handleIndictmentCountChanges,
  updateIndictmentCountState,
}: {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  indictmentCount: TempIndictmentCount
  handleIndictmentCountChanges: (
    update: UpdateIndictmentCount,
    updatedOffenses?: Offense[],
  ) => void
  updateIndictmentCountState: (
    indictmentCountId: string,
    update: UpdateIndictmentCount,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
    updatedOffenses?: Offense[],
  ) => void
}) => {
  const { formatMessage } = useIntl()
  const [bloodAlcoholContentErrorMessage, setBloodAlcoholContentErrorMessage] =
    useState<string>('')

  const { createOffense, updateOffense, deleteOffense } = useOffenses()

  const offenses = useMemo(
    () => indictmentCount.offenses ?? [],
    [indictmentCount.offenses],
  )
  const drunkDrivingOffense = getDrunkDriving(offenses)
  const speedingOffense = getSpeeding(offenses)

  const offensesOptions = useMemo(
    () =>
      Object.values(IndictmentCountOffense).map((offense) => ({
        value: offense,
        label: formatMessage(enumStrings[offense]),
        disabled: offenses.some((o) => o.offense === offense),
      })),
    [formatMessage, offenses],
  )

  // handlers
  const handleCreateOffense = async (
    selectedOffense: IndictmentCountOffense,
  ) => {
    const hasOffense = offenses.some((o) => o.offense === selectedOffense)
    if (!hasOffense) {
      const newOffense = await createOffense(
        workingCase.id,
        indictmentCount.id,
        selectedOffense,
      )
      if (newOffense) {
        const updatedOffenses = [...offenses, newOffense]

        // handle changes on indictment count impacted by creating an offense
        handleIndictmentCountChanges({}, updatedOffenses)
      }
    }
  }

  const handleDeleteOffense = async (
    offenseId: string,
    offense: IndictmentCountOffense,
  ) => {
    await deleteOffense(workingCase.id, indictmentCount.id, offenseId)
    const updatedOffenses = offenses.filter((o) => o.id !== offenseId)

    // handle changes on indictment count impacted by deleting an offense
    handleIndictmentCountChanges(
      {
        ...(offense === IndictmentCountOffense.SPEEDING && {
          recordedSpeed: null,
          speedLimit: null,
        }),
      },
      updatedOffenses,
    )
  }

  const handleOffenseSubstanceUpdate = async (
    offense: Offense,
    updatedSubstances: SubstanceMap,
  ) => {
    const offenseToBeUpdated = {
      substances: {
        ...offense.substances,
        ...updatedSubstances,
      } as SubstanceMap,
    }
    const updatedOffense = await updateOffense(
      workingCase.id,
      indictmentCount.id,
      offense.id,
      offenseToBeUpdated,
    )

    if (updatedOffense) {
      const updatedOffenses = getUpdatedOffenses(offenses, updatedOffense)
      handleIndictmentCountChanges({}, updatedOffenses)
    }
  }

  const handleAlcoholSubstanceUpdate = async (
    offense: Offense,
    alcoholValue: string,
  ) => {
    const substances = {
      ...offense.substances,
      ALCOHOL: alcoholValue,
    } as SubstanceMap
    await handleOffenseSubstanceUpdate(offense, substances)
  }

  return (
    <>
      {/* OFFENSE */}
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
          onChange={async (so) =>
            handleCreateOffense(so?.value as IndictmentCountOffense)
          }
          value={null}
          required
        />
      </Box>
      {isNonEmptyArray(offenses) && (
        <Box marginBottom={2}>
          {offenses.map(({ id: offenseId, offense }) => {
            if (!offense) {
              return null
            }
            return (
              <Box
                display="inlineBlock"
                key={`${indictmentCount.id}-${offenseId}-${offense}`}
                component="span"
                marginBottom={1}
                marginRight={1}
              >
                <Tag
                  variant="darkerBlue"
                  onClick={async () => handleDeleteOffense(offenseId, offense)}
                >
                  <Box display="flex" alignItems="center">
                    {formatMessage(enumStrings[offense])}
                    <Icon icon="close" size="small" />
                  </Box>
                </Tag>
              </Box>
            )
          })}
        </Box>
      )}
      {/* ALCOHOL OFFENSE FIELDS */}
      {drunkDrivingOffense && (
        <Box marginBottom={2}>
          <SectionHeading
            title={formatMessage(strings.bloodAlcoholContentTitle)}
            heading="h4"
            marginBottom={2}
          />
          <InputMask
            mask={'9,99'}
            maskPlaceholder={null}
            value={drunkDrivingOffense.substances?.ALCOHOL ?? ''}
            onChange={async (event) => {
              const alcoholValue = event.target.value
              removeErrorMessageIfValid(
                ['empty'],
                alcoholValue,
                bloodAlcoholContentErrorMessage,
                setBloodAlcoholContentErrorMessage,
              )
              const updatedOffense = {
                ...drunkDrivingOffense,
                substances: {
                  ...drunkDrivingOffense.substances,
                  ALCOHOL: alcoholValue,
                } as SubstanceMap,
              }
              const updatedOffenses = getUpdatedOffenses(
                offenses,
                updatedOffense,
              )

              // only update state since server changes are handled on blur
              updateIndictmentCountState(
                indictmentCount.id,
                {},
                setWorkingCase,
                updatedOffenses,
              )
            }}
            onBlur={async (event) => {
              const alcoholValue =
                event.target.value.length > 0
                  ? `${event.target.value}${'0,00'.slice(
                      event.target.value.length,
                    )}`
                  : event.target.value

              validateAndSetErrorMessage(
                ['empty'],
                alcoholValue,
                setBloodAlcoholContentErrorMessage,
              )
              // update offense and indictment count related fields server side
              await handleAlcoholSubstanceUpdate(
                drunkDrivingOffense,
                alcoholValue,
              )
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
      {/* SPEEDING OFFENSE FIELDS */}
      {speedingOffense && (
        <SpeedingOffenseFields
          setWorkingCase={setWorkingCase}
          indictmentCount={indictmentCount}
          handleIndictmentCountChanges={handleIndictmentCountChanges}
          updateIndictmentCountState={updateIndictmentCountState}
        />
      )}
      {/* DRUG SUBSTANCE FIELDS */}
      {getDrugsDriving(offenses).map((o) => (
        <Box key={`${indictmentCount.id}-${o.offense}-substances`}>
          <Substances offense={o} onChange={handleOffenseSubstanceUpdate} />
        </Box>
      ))}
    </>
  )
}
