import React from 'react'
import { Box, TopicCard, Text } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { AttachmentProps, FileSchema } from '../../lib/constants'
import { Application } from '@island.is/application/types'

interface FileOverviewData {
  application: Application
}

export const FileOverview = ({ application }: FileOverviewData) => {
  return (
    <Box>
      {AttachmentProps.map((a) => {
        const attachment = (
          getValueViaPath(application.answers, a.id) as FileSchema[]
        )[0]
        if (!attachment) {
          return
        }
        const nameArray = attachment.name?.split('.')
        const fileType = nameArray.pop()?.toUpperCase()
        const fileName = nameArray.join()
        return (
          <Box key={attachment.key} marginBottom={2}>
            <Text variant="h4" paddingBottom={1}>
              {a.label}
            </Text>
            <TopicCard tag={fileType || undefined}>{fileName}</TopicCard>
          </Box>
        )
      })}
    </Box>
  )
}
