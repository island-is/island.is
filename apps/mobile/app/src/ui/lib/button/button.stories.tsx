import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { Image, View } from 'react-native'
import familyIcon from '../../assets/icons/family.png'
import { Button } from './button'
import { CancelButton } from './cancel-button'
import { Close } from './close'
import { IconButton } from './icon-button'
import { ListButton } from './list-button'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {children}
  </View>
)

storiesOf('Button', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const title = text('Button title', 'Auðkenna')
    return <Button title={title} onPress={() => void 0} />
  })
  .add('Transparent', () => {
    const title = text('Transparent Button Title', 'Sleppa í bili')

    return (
      <Button
        title={title}
        isTransparent={boolean('Is Transparent', true)}
        onPress={() => void 0}
      />
    )
  })
  .add('Close', () => {
    return <Close />
  })
  .add('Icon Button', () => {
    return (
      <IconButton
        title="Bílar"
        image={
          <Image source={familyIcon as any} style={{ width: 28, height: 20 }} />
        }
      />
    )
  })
  .add('List Button', () => {
    return <ListButton title="Umsókn um fæðingarorlof" />
  })
  .add('Cancel Button', () => {
    return (
      <CancelButton
        title="Sleppa í bili"
        onPress={() => console.log('pressed')}
      />
    )
  })
