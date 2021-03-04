import React from 'react'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'

import { PaymentFlow, frames } from './PaymentFlow'

export default {
  title: 'Form/PaymentFlow',
  component: PaymentFlow,
}

const Template = () => (
  <Box textAlign="center">
    <Text variant="h3" paddingY={4}>
      Payment flow: Choose a card
    </Text>
    <frames.ChooseCard />
    <Text variant="h3" paddingY={4}>
      Payment flow: Add new card
    </Text>
    <frames.NewCard />
    <Text variant="h3" paddingY={4}>
      Payment flow: Success
    </Text>
    <frames.Success />
  </Box>
)

export const Default = Template.bind({})
