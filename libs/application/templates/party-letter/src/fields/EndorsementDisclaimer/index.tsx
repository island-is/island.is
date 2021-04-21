import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { PartyLetter } from '../../lib/dataSchema'

const EndorsementDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const answers = (application as any).answers as PartyLetter

  const partyLetter = answers.party.letter
  const partyName = answers.party.name
  return (
    <Text>
      {formatMessage(m.endorsementDisclaimer.part1)}
      <strong>{` ${partyName} `}</strong>
      {formatMessage(m.endorsementDisclaimer.part2)}
      <strong>{` ${partyLetter}`}</strong>.
    </Text>
  )
}

export default EndorsementDisclaimer
