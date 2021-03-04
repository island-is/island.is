import React from 'react'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'

import { PaymentFlow, frames } from './PaymentFlow'

export default {
  title: 'Form/PaymentFlow',
  component: PaymentFlow,
}

const Template = () => (
  <>
    <Box textAlign="center">
      <Text variant="h3" paddingY={4}>
        Payment flow: Choose a card
      </Text>
    </Box>
    <frames.ChooseCard />
    <Box textAlign="center">
      <Text variant="h3" paddingY={4}>
        Payment flow: Success
      </Text>
    </Box>
    <frames.NewCard />
    <Box textAlign="center">
      <Text variant="h3" paddingY={4}>
        Payment flow: Success
      </Text>
    </Box>
    <frames.Success />
  </>
)

export const Default = Template.bind({})
