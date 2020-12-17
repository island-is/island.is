import React from 'react'
import { HyphenProps, Hyphen } from './Hyphen'
import { Text } from '../Text/Text'

const container = (Story) => (
  <div
    style={{
      resize: 'horizontal',
      overflow: 'auto',
      height: 'auto',
      width: '80%',
      border: '1px solid tomato',
      padding: 20,
    }}
  >
    <Story />
  </div>
)

const description = `
Adds soft hyphens to text, currently only supports Icelandic
`

export default {
  title: 'Core/Hyphen',
  component: Hyphen,
  decorators: [container],
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
}

const Template = (args: HyphenProps) => <Hyphen {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Vaðlaheiðarvegavinnuverkfærageymsluskúrslyklakippuhringurinn',
}

export const UsingText = () => (
  <Text variant="h1" color="blue400">
    <Hyphen>Útlendingastofnun</Hyphen>
  </Text>
)
export const LongTextMin8 = () => (
  <Text variant="h1" color="blue400">
    <Hyphen minLeft={8} minRight={8}>
      Hafrannsóknastofnun: Rannsókna- og ráðgjafarstofnun hafs og vatna
    </Hyphen>
  </Text>
)
