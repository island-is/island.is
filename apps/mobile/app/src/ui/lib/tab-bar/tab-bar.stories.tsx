import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { TabBar } from './tab-bar'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {children}
  </View>
)

storiesOf('Tab Bar', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const label1 = text('Tab Bar Label 1', 'Upplýsingar')
    const label2 = text('Tab Bar Label 2', 'Stillingar')
    return (
      <View style={{ width: '100%' }}>
        <TabBar
          values={[
            {
              testID: 'personalinfo',
              label: label1,
            },
            {
              testID: 'settings',
              label: label2,
            },
          ]}
          onChange={(selectedIndex) => console.log('test')}
          selectedIndex={1}
        />
      </View>
    )
  })
