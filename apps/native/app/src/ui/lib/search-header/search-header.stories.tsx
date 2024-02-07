import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { SearchHeader } from './search-header'

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

storiesOf('Search Header', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const count = number('Search Header Count', 3)
    const loadingText = text('Search Header Loading Text', 'Leita í skjölum')
    const resultText = text('Search Header Result Text', 'niðurstöður fundust')
    return (
      <SearchHeader
        count={count}
        loading={boolean('Loading', false)}
        loadingText={loadingText}
        resultText={resultText}
      />
    )
  })
