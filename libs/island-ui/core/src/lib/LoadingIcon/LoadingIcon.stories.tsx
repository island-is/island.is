import React from 'react'
import { Box } from '../Box/Box'
import { LoadingIcon } from './LoadingIcon'

export default {
  title: 'Navigation/LoadingIcon',
  component: LoadingIcon,
  args: {
    size: 100,
    color: 'blue400',
  },
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: [50, 100, 150, 200, 250],
      },
    },
    color: {
      control: {
        type: 'select',
        options: ['blue400', 'mint400', 'red400'],
      },
    },
  },
}

export const Template = (args) => <LoadingIcon {...args} />

export const Gradient = Template.bind({})
Gradient.args = { color: '' }

export const FitInsideBox = () => {
  return (
    <Box padding={3} background="blue400" style={{ width: 100 }}>
      <LoadingIcon color="white" />
    </Box>
  )
}
