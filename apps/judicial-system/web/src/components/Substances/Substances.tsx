import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import {
  ReactSelectOption,
  TempCase as Case,
  TempIndictmentCount as TIndictmentCount,
} from '@island.is/judicial-system-web/src/types'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts'
import { Box, Input, Select } from '@island.is/island-ui/core'
import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'
import { offenseSubstances, Substance } from '@island.is/judicial-system/types'

import { substanceEnum } from './SubstancesEnum.strings'
import { substances as strings } from './Substances.strings'

import * as styles from './Substances.css'

interface Props {
  indictmentCount: TIndictmentCount
  indictmentCountOffenseType: IndictmentCountOffense

  onChange: (
    indictmentCountId: string,
    updatedIndictmentCount: UpdateIndictmentCount,
  ) => void
  updateIndictmentCountState: (
    indictmentCountId: string,
    update: UpdateIndictmentCount,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
  ) => void
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  getLawsBroken: (
    offenses: IndictmentCountOffense[],
    bloodAlcoholContent?: string,
  ) => [number, number][]
  incidentDescription: (indictmentCount: TIndictmentCount) => string

  legalArguments: (lawsBroken: number[][]) => string
}

const Substances: React.FC<Props> = (props) => {
  const {
    indictmentCount,
    indictmentCountOffenseType,
    onChange,
    updateIndictmentCountState,
    setWorkingCase,
    getLawsBroken,
    incidentDescription,
    legalArguments,
  } = props
  const { formatMessage } = useIntl()

  const getSubstanceOptions = useMemo(
    () =>
      Object.values(offenseSubstances[indictmentCountOffenseType]).map(
        (sub) => ({
          value: sub,
          label: formatMessage(substanceEnum[sub]),
          disabled: indictmentCount.substances
            ? indictmentCount.substances[sub] !== undefined
            : false,
        }),
      ),
    [formatMessage, indictmentCount.substances, indictmentCountOffenseType],
  )

  const renderSubstanceInput = (substance: Substance) => {
    return (
      <Input
        key={`${indictmentCount.id}-${substance}`}
        name={substance}
        autoComplete="off"
        label={`${formatMessage(substanceEnum[substance])} (ng/ml)`}
        placeholder={'0'}
        size="xs"
        value={
          indictmentCount.substances
            ? indictmentCount.substances[substance]
            : ''
        }
        icon={{
          name: 'close',
          onClick: () => {
            if (indictmentCount.substances) {
              delete indictmentCount.substances[substance]
            }
            onChange(indictmentCount.id, {
              substances: indictmentCount.substances,
              incidentDescription: incidentDescription(indictmentCount),
            })
          },
        }}
        onChange={(event) => {
          updateIndictmentCountState(
            indictmentCount.id,
            {
              substances: {
                ...indictmentCount.substances,
                [substance]: event.target.value,
              },
            },
            setWorkingCase,
          )
        }}
        onBlur={(event) => {
          const lawsBroken = getLawsBroken(
            indictmentCount.offenses || [],
            event.target.value,
          )
          const substances = {
            ...indictmentCount.substances,
            [substance]: event.target.value,
          }

          onChange(indictmentCount.id, {
            substances,
            lawsBroken,
            incidentDescription: incidentDescription({
              ...indictmentCount,
              substances,
            }),

            legalArguments: legalArguments(lawsBroken),
          })
        }}
      ></Input>
    )
  }

  return (
    <Box marginBottom={2}>
      <Box marginBottom={2}>
        <Select
          name={`${indictmentCountOffenseType}-offense-type`}
          options={getSubstanceOptions}
          label={formatMessage(strings.substanceLabel, {
            substanceType: indictmentCountOffenseType,
          })}
          placeholder={formatMessage(strings.substancePlaceholder, {
            substanceType: indictmentCountOffenseType,
          })}
          onChange={(selectedOption) => {
            const substance = (selectedOption as ReactSelectOption).value

            const substances = {
              ...indictmentCount.substances,
              [substance]: '',
            }

            onChange(indictmentCount.id, {
              substances,
            })
          }}
          value={null}
          required
        />
      </Box>

      {indictmentCount.substances && (
        <div className={styles.gridRow}>
          {(Object.keys(indictmentCount.substances) as Substance[])
            .filter((s) =>
              offenseSubstances[indictmentCountOffenseType].includes(s),
            )
            .map((substance) => (
              <div key={substance}>{renderSubstanceInput(substance)}</div>
            ))}
        </div>
      )}
    </Box>
  )
}

export default Substances
