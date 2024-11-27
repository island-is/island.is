import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { NavigationBarSheet } from './navigation-bar-sheet'

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

storiesOf('Navigation Bar Sheet', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const title = text('Navigation Bar Sheet Title', 'Notandi')
    return (
      <View style={{ width: '100%' }}>
        <NavigationBarSheet
          componentId="none"
          title={title}
          onClosePress={() => console.log('close')}
          style={{ marginHorizontal: 16 }}
        />
      </View>
    )
  })
