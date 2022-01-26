import { MessageFormatter } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import React, { useMemo } from 'react'
import { useHistory } from 'react-router'
import { editorMsgs } from '../messages'
import { DraftingState } from '../state/types'
import { isDraftErrorFree } from '../state/validations'
import { Step } from '../types'
import { getEditUrl } from '../utils/routing'

type ReviewMessage = {
  label: string
  error: string
  step: Step
}

export const useCollectMessages = (
  state: DraftingState,
  t: MessageFormatter,
): Array<ReviewMessage> =>
  useMemo(() => {
    if (isDraftErrorFree(state)) {
      return []
    }
    const { title, type } = state.draft
    const messages: Array<ReviewMessage> = []

    const titleError = title.error || type.error // …because "type" field errors are caused by weirdly shaped titles
    if (titleError) {
      messages.push({
        label: t(editorMsgs.title),
        error: t(titleError),
        step: 'basics',
      })
    }

    return messages
  }, [state, t])

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------

export type EditReviewWarningsProps = {
  messages: Array<ReviewMessage>
}

export const EditReviewWarnings = (props: EditReviewWarningsProps) => {
  const history = useHistory()

  if (!props.messages) {
    return null
  }

  return (
    <Box marginBottom={4}>
      {props.messages.map((m, i) => (
        <div key={i}>
          {m.label}: {m.error}
          <button onClick={() => history.push(getEditUrl(m.step))}></button>
        </div>
      ))}
    </Box>
  )
}
