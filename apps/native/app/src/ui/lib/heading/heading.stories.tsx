import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Button } from '../button/button'
import { Heading } from './heading'

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

storiesOf('Heading', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Heading', () => {
    const heading = text('Heading Text', 'Tilkynningar')
    return <Heading>{heading}</Heading>
  })
  .add('Heading With Button', () => {
    const heading = text('Heading Text with Button', 'Tilkynningar')
    return (
      <Heading
        button={
          <Button title="Sjá allt" isTransparent onPress={() => void 0} />
        }
      >
        {heading}
      </Heading>
    )
  })
