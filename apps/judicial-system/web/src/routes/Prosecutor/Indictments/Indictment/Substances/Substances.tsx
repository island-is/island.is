import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import {
  ReactSelectOption,
  TempCase as Case,
  TempIndictmentCount as TIndictmentCount,
} from '@island.is/judicial-system-web/src/types'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts'
import { Box, Select } from '@island.is/island-ui/core'
import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  offenseSubstances,
  Substance as SubstanceEnum,
} from '@island.is/judicial-system/types'

import { Substance } from '../Substance/Substance'

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

export const Substances: React.FC<Props> = (props) => {
  const { indictmentCount, indictmentCountOffenseType, onChange } = props
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
          {(Object.keys(indictmentCount.substances) as SubstanceEnum[])
            .filter((s) =>
              offenseSubstances[indictmentCountOffenseType].includes(s),
            )
            .map((substance) => (
              <div key={substance}>
                {<Substance substance={substance} {...props}></Substance>}
              </div>
            ))}
        </div>
      )}
    </Box>
  )
}
