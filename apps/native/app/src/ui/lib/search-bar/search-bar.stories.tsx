import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { SearchBar } from './search-bar'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {children}
  </View>
)

storiesOf('Search Bar', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const placehodler = text('Search Bar Placeholder', 'Leita að skjölum...')
    return (
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <SearchBar value="" placeholder={placehodler} returnKeyType="search" />
      </View>
    )
  })
