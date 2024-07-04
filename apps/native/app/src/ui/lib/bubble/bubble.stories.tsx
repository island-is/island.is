import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Bubble } from './bubble'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ccc',
    }}
  >
    {children}
  </View>
)

storiesOf('Bubble', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const title = text('Bubble text', 'Snúðu símanum að strikamerkinu')
    return <Bubble>{title}</Bubble>
  })
