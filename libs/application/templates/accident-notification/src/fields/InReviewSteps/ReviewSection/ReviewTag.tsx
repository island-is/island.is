import {
  Application,
  coreMessages,
  formatText,
} from '@island.is/application/core'
import { Box, Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { inReview } from '../../../lib/messages'
import { ReviewSectionState } from '../../../types'

type ReviedTagProps = {
  application: Application
  state?: ReviewSectionState
}

export const ReviewTag: FC<ReviedTagProps> = ({ application, state }) => {
  const { formatMessage } = useLocale()

  switch (state) {
    case ReviewSectionState.inProgress:
      return (
        <Box pointerEvents="none">
          <Tag variant="purple">
            {formatText(
              coreMessages.tagsInProgress,
              application,
              formatMessage,
            )}
          </Tag>
        </Box>
      )
    case ReviewSectionState.missing:
      return (
        <Box pointerEvents="none">
          <Tag variant="rose">
            {formatText(inReview.tags.missing, application, formatMessage)}
          </Tag>
        </Box>
      )
    case ReviewSectionState.pending:
      return (
        <Box pointerEvents="none">
          <Tag variant="purple" outlined>
            {formatText(inReview.tags.pending, application, formatMessage)}
          </Tag>
        </Box>
      )
    /* TODO: Need to add new mint color to received and approved when available */
    case ReviewSectionState.received:
      return (
        <Box pointerEvents="none">
          <Tag variant="blue">
            {formatText(inReview.tags.received, application, formatMessage)}
          </Tag>
        </Box>
      )
    case ReviewSectionState.approved:
      return (
        <Box pointerEvents="none">
          <Tag variant="blue">
            {formatText(inReview.tags.pending, application, formatMessage)}
          </Tag>
        </Box>
      )
    case ReviewSectionState.objected:
      return (
        <Box pointerEvents="none">
          <Tag variant="red">
            {formatText(inReview.tags.objected, application, formatMessage)}
          </Tag>
        </Box>
      )
    default:
      return null
  }
}
