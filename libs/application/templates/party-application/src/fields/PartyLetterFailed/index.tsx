import React from 'react'
import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const PartyLetterFailed = () => {
  const { formatMessage } = useLocale()

  return (
    <AlertMessage
      type="warning"
      title={formatMessage(m.partyLetterFailed.title)}
      message={formatMessage(m.partyLetterFailed.description)}
    />
  )
}

export default PartyLetterFailed
