import React from 'react'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const InfoAlert = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginY={2}>
      <AlertMessage
        type="info"
        message="Tilvonandi hjónaefni fær sendan tölvupóst til þess að samþykkja umsókn."
      />
    </Box>
  )
}
