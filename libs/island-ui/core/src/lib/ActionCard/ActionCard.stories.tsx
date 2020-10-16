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
export const Disabled = () => (
  <ActionCard
    heading="Default"
    text="This one is disabled"
    disabled
    disabledLabel="This is the disabled label"
    disabledMessage="This is the message shown"
    cta={{ label: `Doesn't matter, not rendered` }}
  />
)
export const Eyebrow = () => (
  <ActionCard
    heading="With eyebrow"
    eyebrow="Yes it's me"
    text="This is the text"
    cta={{ label: 'Click me' }}
  />
)

export const SecondaryCTA = () => (
  <ActionCard
    heading="Hello"
    text="This is the text"
    cta={{ label: 'Click me', variant: 'secondary' }}
  />
)

export const Tag = () => (
  <ActionCard
    heading="Hello"
    tag="This a tag"
    text="Tags go better with secondary CTA"
    cta={{ label: 'Click me', variant: 'secondary' }}
  />
)
