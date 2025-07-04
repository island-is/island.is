import { withFigma } from '@island.is/island-ui/core'
import type { Meta, StoryObj } from '@storybook/react'
import type { ActionCardProps } from './ActionCard'
import { ActionCard as PortalCard } from './ActionCard'

const config: Meta<typeof PortalCard> = {
  title: 'My pages/Action Card',
  component: PortalCard,
  parameters: withFigma('Portal Card'),
  argTypes: {
    heading: {
      description: 'Heading text',
      control: { type: 'text' },
    },
    headingColor: {
      description: 'Color of the heading text',
      control: { type: 'radio' },
      options: ['blue400', 'blue600', 'currentColor'],
    },
    text: {
      description: 'Text below the heading',
      control: { type: 'text' },
    },
    secondaryText: {
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
    image: {
      description:
        'Displays an image, variants available are: "image", "avatar", "logo" and "circle"',
      control: { type: 'object' },
    },
    cta: {
      description:
        "The main call to action. Variants available are: 'primary', 'ghost', 'text', 'destructive', 'link'.",
      control: { type: 'object' },
    },
    secondaryCta: {
      description:
        "The secondary call to action. Variants available are: 'primary', 'ghost', 'text', 'destructive', 'link'. Displayed if `visible` is true.",
      control: { type: 'object' },
    },
    backgroundColor: {
      description: 'Color theme of the card',
      control: { type: 'radio' },
      options: ['white', 'blue', 'red', 'blueberry'],
    },
    borderColor: {
      description: 'Border color of the card',
      control: { type: 'radio' },
      options: ['blue100', 'blue200', 'red100'],
    },
    loading: {
      description: 'Show loading state',
      control: { type: 'boolean' },
    },
    translateLabel: {
      description: 'Translate label for the card',
      control: { type: 'boolean' },
    },
    tag: {
      description: 'Tag to display on the card',
      control: { type: 'object' },
    },
    secondaryTag: {
      description:
        'Secondary tag to display on the card. Only visible if neither date or eyebrow is set.',
      control: { type: 'object' },
    },
  },
}
export default config

const Template: StoryObj<ActionCardProps> = {
  render: (args) => <PortalCard {...args} />,
}
export const Default = Template

Default.args = {
  heading: 'The main heading',
  text: 'This is the text',
  cta: {
    label: 'Click me',
    variant: 'text',
    centered: true,
  },
  backgroundColor: 'white',
  headingColor: 'currentColor',
  loading: false,
  translateLabel: 'no',
  tag: {
    label: 'Tag',
    variant: 'blue',
    outlined: true,
  },
}

export const BlueCard = () => (
  <PortalCard
    heading="Blue card"
    headingColor="blue600"
    borderColor="blue200"
    backgroundColor="blue"
    text="This is the text"
    cta={{ label: 'Click me', variant: 'text' }}
  />
)

export const RedCard = () => (
  <PortalCard
    heading="Red card"
    headingColor="currentColor"
    borderColor="blue200"
    backgroundColor="red"
    text="This is the text"
    cta={{ label: 'Click me', variant: 'text' }}
  />
)

export const Loading = () => (
  <PortalCard
    heading="Loading card"
    text="The CTA is loading"
    cta={{ label: `...` }}
    loading
  />
)

export const SecondaryTag = () => (
  <PortalCard
    heading="Heading"
    tag={{
      label: 'The Tag',
      variant: 'blue',
    }}
    secondaryTag={{
      label: 'The Second Tag',
      variant: 'red',
    }}
    text="This is the text"
    cta={{ label: 'Click me', variant: 'text' }}
  />
)

export const SecondaryText = () => (
  <PortalCard
    heading="Heading"
    tag={{
      label: 'The Tag',
      variant: 'blue',
    }}
    text="This is the text"
    secondaryText="Text"
    cta={{ label: 'Click me', variant: 'text' }}
  />
)

export const SecondaryButton = () => (
  <PortalCard
    heading="Heading"
    tag={{
      label: 'The Tag',
      variant: 'blue',
    }}
    text="This is the text"
    cta={{ label: 'Click me', variant: 'text' }}
    secondaryCta={{
      label: 'Click me too',
      visible: true,
      size: 'small',
      icon: 'thumbsUp',
    }}
  />
)

export const Image = () => (
  <PortalCard
    heading="Jón Jónsson"
    text="Kennitala: 010100-0100"
    cta={{
      label: 'Skoða upplýsingar',
      variant: 'text',
    }}
    image={{
      type: 'image',
      active: true,
      url: 'https://images.ctfassets.net/8k0h54kbe6bj/3iAG3sT13xfsRzJ6sQI4j5/1a4cf9b42329bd35715c145e28af833f/lifsvidburdur-flytja.svg',
    }}
  />
)

export const Avatar = () => (
  <PortalCard
    heading="Jón Jónsson"
    text="Kennitala: 010100-0100"
    cta={{
      label: 'Skoða upplýsingar',
      variant: 'text',
    }}
    image={{
      type: 'avatar',
      active: true,
    }}
  />
)

export const Logo = () => (
  <PortalCard
    heading="Jón Jónsson"
    text="Kennitala: 010100-0100"
    cta={{
      label: 'Skoða upplýsingar',
      variant: 'text',
    }}
    image={{
      type: 'logo',
      active: true,
      url: 'https://images.ctfassets.net/8k0h54kbe6bj/5ijRCutRCFu4Y9aPS0ys4Z/b809c1cb81df9d27ea99a30e00c2d1e8/is-logo-stakt_2x.png',
    }}
  />
)

export const Disabled = () => (
  <PortalCard
    heading="Disabled card"
    text="This card has no active button"
    cta={{
      label: 'Disabled',
      icon: undefined,
      variant: 'text',
      disabled: true,
    }}
  />
)

export const Destructive = () => (
  <PortalCard
    heading="Delete application in staging environment"
    text="Delete application in staging environment"
    backgroundColor="red"
    cta={{
      label: 'Delete',
      icon: undefined,
      variant: 'primary',
    }}
  />
)
