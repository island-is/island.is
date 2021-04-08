import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const SignatureDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const partyLetter = 'K'
  const partyName = 'Flokkur'
  const constituency = application.answers.constituency
  return (
    <>
      <Text variant="h2" marginBottom={3}>
        {`${formatMessage(m.signatureDisclaimer.title)} (${partyLetter})`}
      </Text>
      <Text marginBottom={2}>
        {`${formatMessage(
          m.signatureDisclaimer.part1,
        )} ${constituency} ${formatMessage(m.signatureDisclaimer.part2)} `}
      </Text>
      <Text>
        {formatMessage(m.signatureDisclaimer.part3)}
        <strong>{` ${partyLetter} `}</strong>
      </Text>
      <Text>
        {formatMessage(m.signatureDisclaimer.part4)}
        <strong>{` ${partyName} `}</strong>
      </Text>
    </>
  )
}

export default SignatureDisclaimer
