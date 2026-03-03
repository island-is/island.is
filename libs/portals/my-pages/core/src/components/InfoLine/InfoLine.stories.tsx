import type { StoryObj, Meta } from '@storybook/react'
import { InfoLine } from './InfoLine'
import { InfoLineStack } from './InfoLineStack'
import { Box } from '@island.is/island-ui/core'

const config: Meta<typeof InfoLine> = {
  title: 'My pages/Info Line',
  component: InfoLine,
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Label text for the InfoLine',
    },
    content: {
      control: { type: 'text' },
      description: 'Content text to display',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Boolean to indicate if the InfoLine is loading',
    },
    warning: {
      control: { type: 'boolean' },
      description: 'Boolean to indicate if the InfoLine has a warning',
    },
    tooltip: {
      control: { type: 'text' },
      description: 'Tooltip text for the label',
    },
    divider: {
      control: { type: 'boolean' },
      description: 'Show divider below the InfoLine',
    },
    printable: {
      control: { type: 'boolean' },
      description: 'Make the InfoLine printable',
    },
  },
}

export default config

export const Default: StoryObj<typeof InfoLine> = {
  render: (args) => <InfoLine {...args} />,
}

Default.args = {
  label: 'Sample Label',
  content: 'This is sample content for the InfoLine component.',
}

export const WithTooltip = () => (
  <InfoLine
    label="Information"
    content="Content with tooltip"
    tooltip="This is a helpful tooltip"
  />
)

export const Loading = () => (
  <InfoLine label="Loading Data" content="Some content" loading={true} />
)

export const WithWarning = () => (
  <InfoLine label="Warning Status" content="Check this value" warning={true} />
)

export const WithActionButton = () => (
  <InfoLine
    label="Action Example"
    content="Content with action button"
    button={{
      type: 'action',
      label: 'Click Me',
      icon: 'checkmark',
      action: () => alert('Button clicked!'),
    }}
  />
)

export const WithDivider = () => (
  <Box>
    <InfoLine label="First Item" content="First content" divider={true} />
    <InfoLine label="Second Item" content="Second content" divider={true} />
    <InfoLine label="Third Item" content="Third content" />
  </Box>
)

export const MultipleInfoLines = () => (
  <Box>
    <InfoLine label="Name" content="Jón Jónsson" divider={true} paddingY={3} />
    <InfoLine
      label="Date of Birth"
      content="01.01.1990"
      divider={true}
      paddingY={3}
    />
    <InfoLine
      label="National ID"
      content="010190-1234"
      divider={true}
      paddingY={3}
    />
    <InfoLine
      label="Address"
      content="Austurstræti 1, 101 Reykjavík"
      paddingY={3}
    />
  </Box>
)

export const CustomLayout = () => (
  <InfoLine
    label="Custom Columns"
    content="This has custom column spans"
    labelColumnSpan={['1/1', '1/1', '1/1', '6/12']}
    valueColumnSpan={['1/1', '1/1', '1/1', '6/12']}
  />
)

export const WithInfoLineStack = () => (
  <InfoLineStack label="Personal Information" space={2} marginBottom={6}>
    <InfoLine label="Name" content="Jón Jónsson" />
    <InfoLine label="Date of Birth" content="01.01.1990" />
    <InfoLine label="National ID" content="010190-1234" />
    <InfoLine label="Address" content="Austurstræti 1, 101 Reykjavík" />
  </InfoLineStack>
)

export const InfoLineStackWithActions = () => (
  <InfoLineStack label="Account Settings" space={3}>
    <InfoLine
      label="Email"
      content="user@example.is"
      button={{
        type: 'action',
        label: 'Edit',
        icon: 'pencil',
        action: () => alert('Edit email'),
      }}
    />
    <InfoLine
      label="Password"
      content="••••••••"
      button={{
        type: 'action',
        label: 'Change',
        icon: 'lockClosed',
        action: () => alert('Change password'),
      }}
    />
    <InfoLine
      label="Two-Factor Auth"
      content="Enabled"
      button={{
        type: 'action',
        label: 'Configure',
        icon: 'settings',
        action: () => alert('Configure 2FA'),
      }}
    />
  </InfoLineStack>
)
