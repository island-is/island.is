import { Box } from '@island.is/island-ui/core'
import React from 'react'
import { DraftChangeForm } from '../../state/types'
import { useDraftingState } from '../../state/useDraftingState'
import { ImpactDate } from './ImpactDate'

type EditChangeProp = {
  change: DraftChangeForm
}

export const EditChange = (props: EditChangeProp) => {
  const { change } = props
  const { draft, actions } = useDraftingState()

  return (
    <Box>
      <ImpactDate
        impact={change}
        onChange={(newDate) => undefined /* FIXME */}
      />
    </Box>
  )
}
