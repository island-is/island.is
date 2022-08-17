import React from 'react'
import { Markdown } from '@island.is/application/ui-components'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const IntroInfo = () => {
  const { formatMessage } = useLocale()

  return (
    <Box style={{ fontSize: 14 }}>
      <AlertMessage
        message={
          <Markdown>{formatMessage(m.introSectionInfoMessage)}</Markdown>
        }
        type="info"
      />
    </Box>
  )
}
