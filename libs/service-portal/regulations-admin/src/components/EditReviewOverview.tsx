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

  const typeName = t(
    draft.type.value === 'amending'
      ? editorMsgs.type_amending
      : editorMsgs.type_base,
  )

  return (
    <Box marginBottom={4}>
      <Box marginBottom={2}>
        <strong>{t(editorMsgs.title)}:</strong> {draft.title.value} ({typeName})
      </Box>
      {draft.impacts.length ? (
        'TODO: Birta yfirlit yfir skráðar áhrifafræslur'
      ) : (
        <Box marginBottom={2}>Engar áhrifafærslur skráðar</Box>
      )}
    </Box>
  )
}
