import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Button } from './button'
import { CancelButton } from './cancel-button'
import { Close } from './close'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {children}
  </View>
)

storiesOf('Button', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const title = text('Button title', 'Auðkenna')
    return <Button title={title} onPress={() => void 0} />
  })
  .add('Transparent', () => {
    const title = text('Transparent Button Title', 'Sleppa í bili')

    return (
      <Button
        title={title}
        isTransparent={boolean('Is Transparent', true)}
        onPress={() => void 0}
      />
    )
  })
  .add('Close', () => {
    return <Close />
  })
  .add('Cancel Button', () => {
    return <CancelButton title="Sleppa í bili" onPress={() => console.log('pressed')} />
  })
