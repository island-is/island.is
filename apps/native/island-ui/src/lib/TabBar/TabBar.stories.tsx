import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { TabBar } from './TabBar'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {children}
  </View>
)

storiesOf('Tab Bar', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <View style={{ width: '100%' }}>
        <TabBar
          values={[
            {
              testID: 'personalinfo',
              label: 'Personal Info',
            },
            {
              testID: 'settings',
              label: 'Settings',
            },
          ]}
          onChange={(selectedIndex) => console.log('test')}
          selectedIndex={1}
        />
      </View>
    )
  })
