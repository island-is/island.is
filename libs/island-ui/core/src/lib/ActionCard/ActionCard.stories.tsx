import React from 'react'

import { ActionCard } from './ActionCard'
import { Meta, StoryObj } from '@storybook/react'
import { withFigma } from '../../utils/withFigma'
import { ActionCardProps } from './types'
import DialogPrompt from '../DialogPrompt/DialogPrompt'
import { Icon } from '../IconRC/Icon'
import { Tag } from '../Tag/Tag'
import { Box } from '../Box/Box'
import { VisuallyHidden } from 'reakit'

export default {
  title: 'Cards/ActionCard',
  component: ActionCard,
  parameters: withFigma('Action Card'),
  argTypes: {
    heading: {
      description: 'Heading text',
      control: { type: 'text' },
    },
    headingVariant: {
      description: 'Heading element',
      control: { type: 'radio' },
      options: ['h3', 'h4'],
    },
    text: {
      description: 'Text below the heading',
      control: { type: 'text' },
    },
    date: {
      description: 'Display date with an icon',
      control: { type: 'text' },
    },
    eyebrow: {
      description: 'Eyebrow text',
      control: { type: 'text' },
    },
    avatar: {
      description: 'Display avatar based on the heading',
      control: { type: 'boolean' },
    },
    cta: {
      description: 'The main call to action',
      control: { type: 'object' },
    },
    unavailable: {
      description: 'Show unavailability message. Leave message empty to hide tooltip.',
      control: { type: 'object' },
    },
    backgroundColor: {
      description: 'Color theme of the card',
      control: { type: 'radio' },
      options: ['white', 'blue', 'red'],
    },
    tag: {
      description: 'Tag to display on the card',
      control: { type: 'object' },
    },
    progressMeter: {
      description: 'Show progress meter',
      control: { type: 'object' },
    },
    focused: {
      description: 'Show focused state',
      control: { type: 'boolean' },
    },
  }
} satisfies Meta<typeof ActionCard>


const Template = (args) => <ActionCard {...args} />
export const Default: StoryObj<ActionCardProps> = Template.bind({})

Default.args = {
  heading: "The main heading",
  headingVariant: "h3",
  
  text: "This is the text",

  date: "17. júní 1944",
  eyebrow: 'Eyebrow',
  avatar: true,
  cta: {
    label: 'Click me',
    buttonType: {
      variant: 'primary',
      colorScheme: 'default',
    }
  },
  unavailable: {
    active: false,
    label: 'Label shown instead of CTA',
    message: 'The message shown in the optional tooltip',
  },
  backgroundColor: undefined,
  tag: {
    label: 'Tag',
    variant: 'blue',
    outlined: true,
  },
  progressMeter: {
    currentProgress: 86,
    maxProgress: 100,
    withLabel: false,
  },
  focused: false,
}

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


export const WithTag = () => (
  <ActionCard
    heading="Heading"
    tag={{
      label: 'The Tag',
      variant: 'blue',
    }}
    text="This is the text"
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
    progressMeter={{
      currentProgress: 30,
      maxProgress: 100,
      withLabel: true,
    }}
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

export const WithDeleteButton = () => (
  <ActionCard
    heading="Delete application in staging environment"
    cta={{
      label: 'Button',
    }}
    tag={{
      label: 'Tag',
      variant: 'blue',
    }}
    date='17. júní 1944'
  />
)

export const WithRenderTag = () => (
  <ActionCard
    heading="With a custom tag"
    text="This story adds tag with a DialogPromp."
    cta={{
      label: 'Button',
    }}
    tag={{
      label: 'Tag',
      variant: 'blue',
      renderTag: (cld) => (
        <>
          {cld}
          <DialogPrompt
            baseId="delete_dialog"
            title="Delete this item?"
            description="More information about the item you are about to delete."
            ariaLabel="delete"
            disclosureElement={
              <Tag outlined variant="blue">
                <VisuallyHidden>Delete</VisuallyHidden>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Icon icon="trash" size="small" type="outline" />
                </Box>
              </Tag>
            }
            onConfirm = {() => 
              console.log('Delete confirmed')
            }
            buttonTextConfirm="Delete"
            buttonTextCancel="Cancel"
          />
        </>
      )
    }}
    date='17. júní 1944'
  />
)
