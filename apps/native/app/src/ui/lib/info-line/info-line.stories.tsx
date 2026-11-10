import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { InfoLine } from './info-line'
import { InfoLineRow } from './info-line-row'

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

storiesOf('InfoLine', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('InfoLine', () => {
    const label = text('InfoLine Label', 'Birtingarnafn')
    const value = text('InfoLine Value', 'Jón Jónsson')
    return (
      <InfoLineRow>
        <InfoLine
          loading={boolean('InfoLine Loading', false)}
          error={boolean('InfoLine Error', false)}
          label={label}
          value={value}
        />
      </InfoLineRow>
    )
  })
  .add('2 InfoLine Row', () => {
    const label = text('2 InfoLine Row Label', 'Kennitala')
    const value = text('2 InfoLine Row Value', '1234568-1234')

    const label2 = text('2 InfoLine Row Label 2', 'Fæðingastaður')
    const value2 = text('2 InfoLine Row Value 2', 'Reykjavík')
    return (
      <View style={{ width: '100%' }}>
        <InfoLineRow>
          <InfoLine loading={false} error={false} label={label} value={value} />
          <InfoLine
            loading={false}
            error={false}
            label={label2}
            value={value2}
          />
        </InfoLineRow>
      </View>
    )
  })
