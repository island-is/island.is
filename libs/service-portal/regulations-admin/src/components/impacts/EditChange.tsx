import { Box } from '@island.is/island-ui/core'
import React from 'react'
import { DraftChangeForm, RegDraftForm } from '../../state/types'
import { ImpactDate } from './ImpactDate'

type EditChangeProp = {
  draft: RegDraftForm
  change: DraftChangeForm
  closeModal: () => void
}

export const EditChange = (props: EditChangeProp) => {
  const { draft, change } = props

  return (
    <Box>
      <ImpactDate
        impact={change}
        onChange={(newDate) => undefined /* FIXME */}
      />
    </Box>
  )
}
