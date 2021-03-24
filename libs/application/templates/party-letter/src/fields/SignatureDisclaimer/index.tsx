import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const SignatureDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const partyLetter = application.answers.partyLetterInput
  const partyName = application.answers.patyNameInput
  return (
    <Text>
      {formatMessage(m.signatureDisclaimer.part1)}
      <strong>{` ${partyName} `}</strong>
      {formatMessage(m.signatureDisclaimer.part2)}
      <strong>{` ${partyLetter}`}</strong>.
    </Text>
  )
}

export default SignatureDisclaimer
