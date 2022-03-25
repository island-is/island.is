import React from 'react'
import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const InfoAlert = () => {
  const { formatMessage } = useLocale()

  return (
    <AlertMessage
      type="info"
      message="Tilvonandi hjónaefni fær sendan tölvupóst til þess að samþykkja umsókn."
    />
  )
}
