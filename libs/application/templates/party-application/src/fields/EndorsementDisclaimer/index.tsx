import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const EndorsementDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const partyLetter = 'K'
  const partyName = 'Flokkur'
  const constituency = application.answers.constituency
  return (
    <>
      <Text variant="h2" marginBottom={3}>
        {`${formatMessage(m.endorsementDisclaimer.title)} (${partyLetter})`}
      </Text>
      <Text marginBottom={2}>
        {`${formatMessage(
          m.endorsementDisclaimer.messagePt1,
        )} ${constituency} ${formatMessage(
          m.endorsementDisclaimer.messagePt2,
        )} `}
      </Text>
      <Text>
        {formatMessage(m.endorsementDisclaimer.partyLetter)}
        <strong>{` ${partyLetter} `}</strong>
      </Text>
      <Text>
        {formatMessage(m.endorsementDisclaimer.partyName)}
        <strong>{` ${partyName} `}</strong>
      </Text>
    </>
  )
}

export default EndorsementDisclaimer
