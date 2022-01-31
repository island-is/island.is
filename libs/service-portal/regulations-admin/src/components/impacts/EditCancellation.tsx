import { Box } from '@island.is/island-ui/core'
import React from 'react'
import { DraftCancelForm } from '../../state/types'
import { useDraftingState } from '../../state/useDraftingState'
import { ImpactDate } from './ImpactDate'

type EditCancellationProp = {
  cancellation: DraftCancelForm
}

export const EditCancellation = (props: EditCancellationProp) => {
  const { cancellation } = props
  const { draft, actions } = useDraftingState()

  return (
    <Box>
      <ImpactDate
        impact={cancellation}
        onChange={(newDate) => undefined /* FIXME */}
      />
    </Box>
  )
}
