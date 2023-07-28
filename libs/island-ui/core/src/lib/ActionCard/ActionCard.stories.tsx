import React from 'react'

import { ActionCard } from './ActionCard'

export default {
  title: 'Cards/ActionCard',
  component: ActionCard,
}

export const Default = () => (
  <ActionCard
    heading="Default"
    text="This is the text"
    cta={{ label: 'Click me' }}
  />
)

export const SmallHeading = () => (
  <ActionCard
    headingVariant="h4"
    heading="Small Heading"
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
    cta={{ label: 'Click me' }}
    secondaryCta={{ label: 'Click me' }}
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
    cta={{ label: 'Click me', variant: 'text' }}
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
    cta={{ label: 'Continue process', variant: 'text' }}
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
    cta={{ label: 'Continue process', variant: 'text' }}
  />
)

export const ApplicationCardInProgressVariant = () => (
  <ActionCard
    date="16/03/2021"
    heading="Parental Leave"
    tag={{
      label: 'In Progress',
      variant: 'blue',
      outlined: false,
    }}
    text="Your application is in progress. Waiting for VMST approval."
    cta={{
      label: 'Open application',
      variant: 'ghost',
      size: 'small',
      icon: undefined,
    }}
  />
)

export const ApplicationCardCompletedVariant = () => (
  <ActionCard
    date="16/03/2021"
    heading="Parental Leave"
    tag={{
      label: 'Completed',
      variant: 'blue',
      outlined: false,
    }}
    text="Your application is in progress. Waiting for VMST approval."
    cta={{
      label: 'Open application',
      variant: 'ghost',
      size: 'small',
      icon: undefined,
    }}
  />
)

export const Avatar = () => (
  <ActionCard
    avatar
    heading="Jón Jónsson"
    text="Kennitala: 010100-0100"
    cta={{
      label: 'Skoða upplýsingar',
      variant: 'text',
      size: 'small',
    }}
  />
)

export const Destructive = () => (
  <ActionCard
    heading="Delete application in staging environment"
    headingVariant="h4"
    text="Delete application in staging environment"
    backgroundColor="red"
    cta={{
      label: 'Delete',
      buttonType: {
        variant: 'primary',
        colorScheme: 'destructive',
      },
      icon: undefined,
    }}
  />
)
