import { storiesOf } from '@storybook/react-native'
import { text, withKnobs } from '@storybook/addon-knobs';
import React from 'react'
import { View } from 'react-native';
import { Input } from './Input'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>{children}</View>
)

storiesOf('Input', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Default Input', () => {
    const placeholder = text('Placeholder', 'Lykilorð');
    return (
      <Input placeholder={placeholder} />
    );
  })
