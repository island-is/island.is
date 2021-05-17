import { storiesOf } from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react'
import { View } from 'react-native';
import { Heading } from './Heading';
import { Close } from '../Button/Close';

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 16 }}>{children}</View>
)

storiesOf('Heading', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Default Heading', () => {
    return (
      <Heading>Tilkynningar</Heading>
    );
  })
  .add('Heading With Button', () => {
    return (
      <Heading button={<Close />}>Tilkynningar</Heading>
    );
  })
