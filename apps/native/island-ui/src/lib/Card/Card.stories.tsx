import { storiesOf } from '@storybook/react-native'
import { text, withKnobs } from '@storybook/addon-knobs';
import React from 'react'
import { View } from 'react-native';
import { Card, CardColor } from './Card'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>{children}</View>
)

storiesOf('Card', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Deafult card', () => {
    const title = text('Badge title', 'Ökuskírteini');
    return (
      <Card title={title} />
    );
  })
  .add('Yellow card', () => (
    <Card title="Siglingapróf" color={CardColor.YELLOW} />
  ))
