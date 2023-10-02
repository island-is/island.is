import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select } from '@island.is/island-ui/core'
import {
  offenseSubstances,
  Substance as SubstanceEnum,
} from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ReactSelectOption,
  TempIndictmentCount as TIndictmentCount,
} from '@island.is/judicial-system-web/src/types'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts'

import { Substance } from '../Substance/Substance'
import { substances as strings } from './Substances.strings'
import { substanceEnum } from './SubstancesEnum.strings'
import * as styles from './Substances.css'

interface Props {
  indictmentCount: TIndictmentCount
  indictmentCountOffenseType: IndictmentCountOffense
  onChange: (updatedIndictmentCount: UpdateIndictmentCount) => void
}

export const Substances: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {
    indictmentCount,
    indictmentCountOffenseType,

    onChange,
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

  const handleUpdateSubstanceAmount = (
    substanceId: SubstanceEnum,
    substanceAmount: string,
  ) => {
    const substances = {
      ...indictmentCount.substances,
      [substanceId]: substanceAmount,
    }
    onChange({ substances })
  }

  const handleDeleteSubstance = (substanceId: SubstanceEnum) => {
    if (indictmentCount.substances) {
      delete indictmentCount.substances[substanceId]
    }
    onChange({ substances: indictmentCount.substances })
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

            onChange({ substances })
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
                {
                  <Substance
                    substance={substance}
                    amount={
                      (indictmentCount.substances &&
                        indictmentCount.substances[substance]) ||
                      ''
                    }
                    onUpdateAmount={handleUpdateSubstanceAmount}
                    onDelete={handleDeleteSubstance}
                  ></Substance>
                }
              </div>
            ))}
        </div>
      )}
    </Box>
  )
}
