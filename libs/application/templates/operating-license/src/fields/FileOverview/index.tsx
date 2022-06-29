import React from 'react'

import { Box, TopicCard } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { FileSchema } from '../../lib/constants'

interface FileOverviewData {
  application: Application
}

export const FileOverview = ({ application }: FileOverviewData) => {
  const { formatMessage } = useLocale()
  const attachments: FileSchema[] = application.answers
    .attachments as FileSchema[]
  return (
    <Box>
      {attachments.map((a) => (
        <Box key={a.key} marginBottom={2}>
          <TopicCard tag={a.name.split('.').pop()?.toUpperCase()}>
            {a.name}
          </TopicCard>{' '}
        </Box>
      ))}
    </Box>
  )
}
