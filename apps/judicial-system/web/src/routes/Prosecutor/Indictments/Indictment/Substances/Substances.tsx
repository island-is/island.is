import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select } from '@island.is/island-ui/core'
import {
  offenseSubstances,
  Substance as SubstanceEnum,
  SubstanceMap,
} from '@island.is/judicial-system/types'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { Offense } from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

import { Substance } from './Substance'
import { strings as sStrings } from './Substance.strings'
import { strings } from './Substances.strings'
import * as styles from './Substances.css'

interface Props {
  offense: Offense
  onChange: (offense: Offense, substances: SubstanceMap) => void
}

export const Substances: FC<Props> = ({ offense, onChange }) => {
  const { formatMessage } = useIntl()
  const { offense: offenseType, substances } = offense

  const getSubstanceOptions = useMemo(
    () =>
      Object.values(offenseSubstances[offenseType]).map((sub) => ({
        value: sub,
        label: sStrings[sub],
        disabled: substances ? substances[sub] !== undefined : false,
      })),
    [substances, offenseType],
  )

  const handleUpdateSubstanceAmount = (
    substanceId: SubstanceEnum,
    substanceAmount: string,
  ) => {
    const updatedSubstances = {
      ...substances,
      [substanceId]: substanceAmount,
    }
    onChange(offense, updatedSubstances)
  }

  const handleDeleteSubstance = (substanceId: SubstanceEnum) => {
    if (substances) {
      delete substances[substanceId]
    }
    onChange(offense, substances)
  }

  return (
    <Box marginBottom={2}>
      <SectionHeading
        title={formatMessage(strings.substanceTitle, {
          substanceType: offenseType,
        })}
        heading="h4"
        marginBottom={2}
      />
      <Box marginBottom={2}>
        <Select
          name={`${offenseType}-offense-type`}
          options={getSubstanceOptions}
          label={formatMessage(strings.substanceLabel, {
            substanceType: offenseType,
          })}
          placeholder={formatMessage(strings.substancePlaceholder, {
            substanceType: offenseType,
          })}
          onChange={(selectedOption) => {
            const substance = (selectedOption as ReactSelectOption).value
            if (!substance) return

            const updatedSubstances = {
              ...substances,
              [substance]: '',
            }
            onChange(offense, updatedSubstances)
          }}
          value={null}
          required
        />
      </Box>

      {substances && (
        <div className={styles.gridRow}>
          {(Object.keys(substances) as SubstanceEnum[])
            .filter((s) => offenseSubstances[offenseType].includes(s))
            .map((substance) => (
              <div key={substance}>
                {
                  <Substance
                    substance={substance}
                    amount={(substances && substances[substance]) || ''}
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
