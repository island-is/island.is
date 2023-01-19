import React from 'react'
import { DraftProgressMeter } from './DraftProgressMeter'

export default {
  title: 'Components/ProgressMeter',
  component: DraftProgressMeter,
  parameters: {
    docs: {
      description: {
        component:
          'A progress meter that shows progress of a number from 0 to 1',
      },
    },
  },
}

export const Default = () => {
  return <DraftProgressMeter draftFinishedSteps={1} draftTotalSteps={2} />
}

export const RedColorScheme = () => {
  return (
    <DraftProgressMeter
      draftFinishedSteps={1}
      draftTotalSteps={2}
      variant="red"
    />
  )
}

export const RoseColorScheme = () => {
  return (
    <DraftProgressMeter
      draftFinishedSteps={1}
      draftTotalSteps={2}
      variant="rose"
    />
  )
}
