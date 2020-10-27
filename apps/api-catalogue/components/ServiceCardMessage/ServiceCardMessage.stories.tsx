import React from 'react'
import { ServiceCardMessage } from './ServiceCardMessage'

export default {
  title: 'Components/ServiceCardMessage',
  component: ServiceCardMessage,
}

export const Default = () => (
  <div style={{ display: 'flex' }}>
    <ServiceCardMessage
      title="Default ServiceCardMessage"
      text="The text which should be displayed.  No border is around the card"
    />
    <ServiceCardMessage
      title="No border"
      text="The text which should be displayed. but no border around "
      borderStyle="none"
      messageType="default"
    />
    <ServiceCardMessage
      title="Height should grow"
      text="The text which should be displayed.  This text is long and will be wrapped and the height will grow.  This text is pretty long and uneventful but it should show how this card grows when there is more room needed because. Lorem ipsum stuff and go"
      size="growHeight"
      messageType="default"
    />
  </div>
)

export const Error = () => (
  <div>
    <ServiceCardMessage
      title="Default Error message"
      text="This is the default error service card message type."
      messageType="error"
    />
    <ServiceCardMessage
      title="No border"
      borderStyle="none"
      text="The text which should be displayed"
      messageType="error"
    />
    <ServiceCardMessage
      title="Height should grow"
      borderStyle="default"
      text="The text which should be displayed.  This text is long and will be wrapped and the height will grow.  This text is pretty long and uneventful but it should show how this card grows when there is more room needed because. Lorem ipsum stuff and go"
      size="growHeight"
      messageType="error"
    />
  </div>
)
