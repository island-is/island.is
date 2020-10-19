import React from 'react'
import { ActionCard } from './ActionCard'

export default {
  title: 'Cards/ActionCard',
  component: ActionCard,
  parameters: {
    docs: {
      description: {
        component: 'TODO',
      },
    },
  },
}

export const Default = () => (
  <ActionCard
    heading="Default"
    text="This is the text"
    cta={{ label: 'Click me' }}
  />
)
export const Unavailable = () => (
  <ActionCard
    heading="Default"
    text="This one is unavailable"
    unavailable={{
      active: true,
      label: 'This is the unavailability label',
      message: 'And this is the tooltip message shown above',
    }}
    cta={{ label: `Doesn't matter, not rendered` }}
  />
)

export const SecondaryCTA = () => (
  <ActionCard
    heading="Hello"
    text="This is the text"
    cta={{ label: 'Click me', variant: 'secondary' }}
  />
)

export const WithTag = () => (
  <ActionCard
    heading="Hello"
    tag={{
      label: 'This a tag',
      variant: 'blue',
    }}
    text="Tags go better with secondary CTA"
    cta={{ label: 'Click me', variant: 'secondary' }}
  />
)

export const WithProgressMeter = () => (
  <ActionCard
    heading="DB-J90"
    tag={{
      label: 'Take to recycling company',
      variant: 'blue',
    }}
    text="Toyota CHR"
    cta={{ label: 'Continue process', variant: 'secondary' }}
    progressMeter={{
      active: true,
      progress: 0.7,
    }}
  />
)

export const RoseColoredProgressMeter = () => (
  <ActionCard
    heading="DB-J90"
    tag={{
      label: 'Take to recycling company',
      variant: 'rose',
    }}
    text="Toyota CHR"
    cta={{ label: 'Continue process', variant: 'secondary' }}
    progressMeter={{
      active: true,
      progress: 0.7,
      variant: 'rose',
    }}
  />
)
