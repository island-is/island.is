import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Alert } from './alert'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>{children}</View>
)

storiesOf('Alert', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Info', () => {
    const message = text(
      'Info Alert meassage',
      'Til að nota skírteini sem gild skilríki þarf að færa þau yfir í Apple Wallet.',
    )

    return (
      <Alert
        key="alert1"
        type="info"
        message={message}
        hideIcon={boolean('Hide Info Icon', false)}
      />
    )
  })
  .add('Info No Icon', () => {
    const message = text(
      'Info Alert meassage',
      'Til að nota skírteini sem gild skilríki þarf að færa þau yfir í Apple Wallet.',
    )

    return <Alert key="alert2" type="info" message={message} hideIcon={true} />
  })
  .add('Success', () => {
    const message = text(
      'Success Alert meassage',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in',
    )

    return <Alert key="alert3" type="success" message={message} />
  })
  .add('Error', () => {
    const message = text(
      'Error Alert meassage',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in',
    )

    return <Alert key="alert4" type="error" message={message} />
  })
  .add('Warning', () => {
    const message = text(
      'Warning Alert meassage',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in',
    )

    return <Alert key="alert5" type="warning" message={message} />
  })
