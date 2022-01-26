import { Box } from '@island.is/island-ui/core'
import React from 'react'
import { useHistory } from 'react-router'
import { editorMsgs } from '../messages'
import { RegDraftForm } from '../state/types'
import { useLocale } from '../utils'

export type EditReviewOverviewProps = {
  draft: RegDraftForm
  hasWarnings: boolean
}

export const EditReviewOverview = (props: EditReviewOverviewProps) => {
  const t = useLocale().formatMessage
  const history = useHistory()
  const { draft, hasWarnings } = props

  if (hasWarnings) {
    return null
  }

  return (
    <Box marginBottom={4}>
      <Box marginBottom={2}>
        {t(editorMsgs.title)}: {draft.title.value}{' '}
        {draft.type.value &&
          ` (${t(
            draft.type.value === 'amending'
              ? editorMsgs.type_amending
              : editorMsgs.type_base,
          )})`}
      </Box>
    </Box>
  )
}
