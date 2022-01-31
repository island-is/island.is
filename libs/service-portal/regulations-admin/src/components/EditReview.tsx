import React, { useState } from 'react'
import { Box, Button, Checkbox, Divider } from '@island.is/island-ui/core'
import { buttonsMsgs, reviewMessagse } from '../messages'
import { useLocale } from '../utils'
import { useDraftingState } from '../state/useDraftingState'
import { EditReviewWarnings, useCollectMessages } from './EditReviewWarnings'
import { EditReviewOverview } from './EditReviewOverview'

export const EditReview = () => {
  const t = useLocale().formatMessage
  const state = useDraftingState()
  const { actions } = state
  const { publish, propose } = actions

  const messages = useCollectMessages(state, t)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Box marginY={[4, 4, 8]}>
      <EditReviewWarnings messages={messages} />
      <EditReviewOverview hasWarnings={!!messages} />

      {!messages && publish && (
        <Box>
          <Box marginBottom={[0, 0, 2]}>
            <Divider />
            {' '}
          </Box>

          <Box marginBottom={[2, 2, 4]}>
            <Checkbox
              label={t(reviewMessagse.confirmBeforePublish)}
              labelVariant="default"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
          </Box>

          <Button
            icon="document"
            disabled={confirmed}
            onClick={() => publish()}
          >
            {t(buttonsMsgs.publish)}
          </Button>
        </Box>
      )}
    </Box>
  )
}
