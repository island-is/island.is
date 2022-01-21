import React from 'react'
import { Box, Button, Inline, Text } from '@island.is/island-ui/core'
import { buttonsMsgs as msg } from '../messages'
import { useLocale } from '../utils'
import { useDraftingState } from '../state/useDraftingState'

// ---------------------------------------------------------------------------

export const EditReview = () => {
  const t = useLocale().formatMessage
  const { draft, actions } = useDraftingState()

  // const { ... } = actions

  return (
    <Box marginY={[4, 4, 8]}>
      <Text>Vinsamlega staðfestu að reglugerðin sé rétt skráð, ...</Text>
      <Text marginBottom={[4, 4, 8]}>(Hér á eftir að hanna yfirlit...)</Text>
      <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
        <Button icon="document">{t(msg.publish)}</Button>
      </Inline>
    </Box>
  )
}
