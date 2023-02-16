import { useState } from 'react'
import { Box, Button, Checkbox, Divider } from '@island.is/island-ui/core'
import { buttonsMsgs, reviewMessages } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useDraftingState } from '../state/useDraftingState'
import { EditReviewWarnings, useCollectMessages } from './EditReviewWarnings'
import { EditReviewOverview } from './EditReviewOverview'

export const EditReview = () => {
  const t = useLocale().formatMessage
  const state = useDraftingState()
  const { actions } = state
  const { ship } = actions

  const messages = useCollectMessages(state, t)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Box marginBottom={4}>
      <EditReviewWarnings messages={messages} />
      <EditReviewOverview hasWarnings={!!messages?.length} />

      {!messages?.length && ship && (
        <Box>
          <Box marginBottom={[0, 0, 2]}>
            <Divider />
            {' '}
          </Box>

          <Box marginBottom={[2, 2, 4]}>
            <Checkbox
              label={t(reviewMessages.confirmBeforePublish)}
              labelVariant="default"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
          </Box>

          <Button icon="document" disabled={!confirmed} onClick={() => ship()}>
            {t(buttonsMsgs.publish)}
          </Button>
        </Box>
      )}
    </Box>
  )
}
