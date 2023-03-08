import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import {
  TempCase as Case,
  TempIndictmentCount as TIndictmentCount,
} from '@island.is/judicial-system-web/src/types'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts'
import { Input } from '@island.is/island-ui/core'
import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'
import { Substance as SubstanceEnum } from '@island.is/judicial-system/types'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'

import { substanceEnum } from '../Substances/SubstancesEnum.strings'

interface Props {
  indictmentCount: TIndictmentCount
  substance: SubstanceEnum

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

export const Substance: React.FC<Props> = (props) => {
  const {
    indictmentCount,
    substance,
    onChange,
    updateIndictmentCountState,
    setWorkingCase,
    getLawsBroken,
    incidentDescription,
    legalArguments,
  } = props
  const { formatMessage } = useIntl()

  const [
    substanceAmountMissingErrorMessage,
    setSubstanceAmountMissingErrorMessage,
  ] = useState<string>('')

  return (
    <Input
      key={`${indictmentCount.id}-${substance}`}
      name={substance}
      autoComplete="off"
      label={`${formatMessage(substanceEnum[substance])} ${
        [SubstanceEnum.GABAPENTIN, SubstanceEnum.PREGABALIN].includes(substance)
          ? '(µg/ml)'
          : '(ng/ml)'
      }`}
      placeholder={'0'}
      size="xs"
      value={
        indictmentCount.substances ? indictmentCount.substances[substance] : ''
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
        removeErrorMessageIfValid(
          ['empty'],
          event.target.value,
          substanceAmountMissingErrorMessage,
          setSubstanceAmountMissingErrorMessage,
        )

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
        validateAndSetErrorMessage(
          ['empty'],
          event.target.value,
          setSubstanceAmountMissingErrorMessage,
        )

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
      errorMessage={substanceAmountMissingErrorMessage}
      hasError={substanceAmountMissingErrorMessage !== ''}
    ></Input>
  )
}
