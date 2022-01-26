import React, { useState } from 'react'
import { Box, Button, Checkbox } from '@island.is/island-ui/core'
import { buttonsMsgs, reviewMessagse } from '../messages'
import { useLocale } from '../utils'
import { useDraftingState } from '../state/useDraftingState'
import { EditReviewWarnings, useCollectMessages } from './EditReviewWarnings'
import { EditReviewOverview } from './EditReviewOverview'

export const EditReview = () => {
  const t = useLocale().formatMessage
  const state = useDraftingState()
  const { draft, actions } = state
  const { publish, propose } = actions

  const messages = useCollectMessages(state, t)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Box marginY={[4, 4, 8]}>
      <EditReviewWarnings messages={messages} />
      <EditReviewOverview draft={draft} hasWarnings={!messages.length} />

      {propose ? (
        <Box>
          <Button icon="open" disabled={confirmed} onClick={() => propose()}>
            {t(buttonsMsgs.propose)}
          </Button>
        </Box>
      ) : (
        publish &&
        !messages && (
          <Box>
            <Checkbox
              label={t(reviewMessagse.confirmBeforePublish)}
              labelVariant="default"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />

            {publish && (
              <Button
                icon="document"
                disabled={confirmed}
                onClick={() => publish()}
              >
                {t(buttonsMsgs.publish)}
              </Button>
            )}
          </Box>
        )
      )}
    </Box>
  )
}
