import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Button } from '../button/button'
import { SectionHeader } from './section-header'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16,
    }}
  >
    {children}
  </View>
)

storiesOf('SectionHeader', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('SectionHeader', () => {
    const heading = text('SectionHeader Text', 'Tilkynningar')
    return <SectionHeader>{heading}</SectionHeader>
  })
  .add('SectionHeader With Button', () => {
    const heading = text('SectionHeader Text with Button', 'Tilkynningar')
    return (
      <SectionHeader
        button={
          <Button title="Sjá allt" isTransparent onPress={() => void 0} />
        }
      >
        {heading}
      </SectionHeader>
    )
  })
