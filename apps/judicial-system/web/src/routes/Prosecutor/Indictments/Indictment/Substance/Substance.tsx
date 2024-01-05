import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { Substance as SubstanceEnum } from '@island.is/judicial-system/types'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'

import { substanceEnum } from '../Substances/SubstancesEnum.strings'

interface Props {
  substance: SubstanceEnum
  amount: string
  onUpdateAmount: (sub: SubstanceEnum, amount: string) => void
  onDelete: (sub: SubstanceEnum) => void
}

export const Substance: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { substance, onUpdateAmount, onDelete, amount } = props
  const { formatMessage } = useIntl()

  const [
    substanceAmountMissingErrorMessage,
    setSubstanceAmountMissingErrorMessage,
  ] = useState<string>('')

  const [substanceAmount, setSubstanceAmount] = useState<string>(amount)

  return (
    <Input
      key={`substance-${substance}`}
      name={substance}
      autoComplete="off"
      label={`${formatMessage(substanceEnum[substance])} ${
        [SubstanceEnum.GABAPENTIN, SubstanceEnum.PREGABALIN].includes(substance)
          ? '(µg/ml)'
          : '(ng/ml)'
      }`}
      placeholder={'0'}
      size="xs"
      value={substanceAmount}
      buttons={[
        {
          name: 'close',
          onClick: () => {
            onDelete(substance)
          },
          label: 'Eyða',
        },
      ]}
      onChange={(event) => {
        removeErrorMessageIfValid(
          ['empty'],
          substanceAmount,
          substanceAmountMissingErrorMessage,
          setSubstanceAmountMissingErrorMessage,
        )

        setSubstanceAmount(event.target.value)
      }}
      onBlur={() => {
        validateAndSetErrorMessage(
          ['empty'],
          substanceAmount,
          setSubstanceAmountMissingErrorMessage,
        )

        onUpdateAmount(substance, substanceAmount)
      }}
      errorMessage={substanceAmountMissingErrorMessage}
      hasError={substanceAmountMissingErrorMessage !== ''}
    ></Input>
  )
}
