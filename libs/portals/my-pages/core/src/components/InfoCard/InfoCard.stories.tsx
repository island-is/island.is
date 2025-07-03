import type { StoryObj, Meta } from '@storybook/react'
import { InfoCard, InfoCardProps } from './InfoCard'

const config: Meta<typeof InfoCard> = {
  title: 'My pages/Info Card',
  component: InfoCard,
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Title of the InfoCard',
    },
    description: {
      control: { type: 'text' },
      description: 'Description of the InfoCard',
    },

    size: {
      control: { type: 'select' },
      options: ['small', 'large'],
      description: 'Size of the InfoCard',
    },
    detail: {
      control: { type: 'array' },
      description: 'Array of details to display in the InfoCard',
    },
    appointment: {
      control: { type: 'object' },
      description: 'Appointment details to display in the InfoCard',
    },
    tooltip: {
      control: { type: 'text' },
      description: 'Tooltip text for the InfoCard',
    },
    tags: {
      control: { type: 'array' },
      description: 'Array of tags to display on the InfoCard',
    },
    img: {
      control: { type: 'text' },
      description: 'Image URL to display on the InfoCard',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'detail', 'appointment', 'link'],
      description: 'Variant of the InfoCard',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Boolean to indicate if the InfoCard is loading',
    },
  },
}

export default config

export const Default: StoryObj<InfoCardProps> = {
  render: (args) => <InfoCard {...args} />,
}

Default.args = {
  title: 'Sample Title',
  description: 'This is a sample description for the InfoCard component.',
}
export const Detail = () => (
  <InfoCard
    title="Detail card"
    description="This is a card with details"
    detail={[
      { label: 'Today', value: '1.janúar 2025' },
      { label: 'Tomorrow', value: '2.janúar 2025' },
    ]}
  />
)

export const LargeWithImage = () => (
  <InfoCard
    title="Detail card"
    description="This is a card with details"
    detail={[
      { label: 'Today', value: '1.janúar 2025' },
      { label: 'Tomorrow', value: '2.janúar 2025' },
    ]}
    img="https://placehold.co/400x200"
    variant="detail"
    size="large"
  />
)
