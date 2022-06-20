import React from 'react'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import Markdown from 'markdown-to-jsx'
import { m } from '../../lib/messages'
import { markdownOptions } from './markdownOptions'

export const IntroInfo = () => {
  const { formatMessage } = useLocale()

  return (
    <Box style={{ fontSize: 14, fontWeight: 300 }}>
      <AlertMessage
        message={
          <Markdown options={markdownOptions}>
            {formatMessage(m.introSectionInfoMessage)}
          </Markdown>
        }
        type="info"
      />
    </Box>
  )
}
