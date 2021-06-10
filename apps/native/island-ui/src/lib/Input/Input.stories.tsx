import { withKnobs } from '@storybook/addon-knobs'
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
    return (
      <InputRow>
        <Input
          loading={false}
          error={false}
          label="Birtingarnafn"
          value="Jón Jónsson"
        />
      </InputRow>
    )
  })
  .add('2 Input Row', () => {
    return (
      <View style={{ width: '100%' }}>
        <InputRow>
          <Input
            loading={false}
            error={false}
            label="Kennitala"
            value="1234568-1234"
          />
          <Input
            loading={false}
            error={false}
            label="Fæðingastaður"
            value="Reykjavík"
          />
        </InputRow>
      </View>
    )
  })
