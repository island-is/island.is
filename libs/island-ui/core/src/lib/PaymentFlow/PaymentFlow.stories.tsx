import React from 'react'
import { Text } from '../Text/Text'

import { PaymentFlow, frames } from './PaymentFlow'

export default {
  title: 'Form/PaymentFlow',
  component: PaymentFlow,
}

const Template = (args) => (
  <>
    <Text>Choose a card</Text>
    <frames.ChooseCard />
    <Text>Add new card</Text>
    <frames.NewCard />
    <Text>Success</Text>
    <frames.Success />
  </>
)

export const Default = Template.bind({})
