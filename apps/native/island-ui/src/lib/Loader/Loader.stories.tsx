import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Loader } from './Loader'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}
  >
    {children}
  </View>
)

storiesOf('Loader', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return <Loader />
  })
  .add('Default With Text', () => {
    return <Loader text="Sæki skjal" />
  })
