import React from 'react'
import { DraftProgressMeter } from './DraftProgressMeter'

export default {
  title: 'Components/DraftProgressMeter',
  component: DraftProgressMeter,
  parameters: {
    docs: {
      description: {
        component:
          'A progress meter that shows the progress of a multi-step process.',
      },
    },
  },
}

export const Default = () => {
  return (
    <DraftProgressMeter
      draftFinishedSteps={1}
      draftTotalSteps={2}
      progressMessage="Þú hefur klárað 1 af 2 skrefum"
    />
  )
}

export const RedColorScheme = () => {
  return (
    <DraftProgressMeter
      draftFinishedSteps={1}
      draftTotalSteps={2}
      progressMessage="Þú hefur klárað 1 af 2 skrefum"
      variant="red"
    />
  )
}

export const RoseColorScheme = () => {
  return (
    <DraftProgressMeter
      draftFinishedSteps={1}
      draftTotalSteps={2}
      progressMessage="Þú hefur klárað 1 af 2 skrefum"
      variant="rose"
    />
  )
}
