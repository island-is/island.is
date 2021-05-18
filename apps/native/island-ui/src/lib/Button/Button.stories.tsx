import { storiesOf } from '@storybook/react-native'
import { text, withKnobs, boolean } from '@storybook/addon-knobs';
import React from 'react'
import { View } from 'react-native';
import { Button } from './Button'
import { Close } from './Close';

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>{children}</View>
)

storiesOf('Button', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const title = text('Button title', 'Auðkenna');
    return (
      <Button title={title} onPress={() => void 0} />
    );
  })
  .add('Transparent', () => {
    const title = text('Transparent Button Title', 'Sleppa í bili');

    return (
      <Button title={title} isTransparent={boolean('Is Transparent', true)} onPress={() => void 0} />
    );
  })
  .add('Close', () => {
    return (
      <Close />
    );
  })
