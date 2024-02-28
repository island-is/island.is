import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Input } from './input'
import { InputRow } from './input-row'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}
  >
    {children}
  </View>
)

storiesOf('Input', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Input', () => {
    const label = text('Input Label', 'Birtingarnafn')
    const value = text('Input Value', 'Jón Jónsson')
    return (
      <InputRow>
        <Input
          loading={boolean('Input Loading', false)}
          error={boolean('Input Error', false)}
          label={label}
          value={value}
        />
      </InputRow>
    )
  })
  .add('2 Input Row', () => {
    const label = text('2 Input Row Label', 'Kennitala')
    const value = text('2 Input Row Value', '1234568-1234')

    const label2 = text('2 Input Row Label 2', 'Fæðingastaður')
    const value2 = text('2 Input Row Value 2', 'Reykjavík')
    return (
      <View style={{ width: '100%' }}>
        <InputRow>
          <Input loading={false} error={false} label={label} value={value} />
          <Input loading={false} error={false} label={label2} value={value2} />
        </InputRow>
      </View>
    )
  })
