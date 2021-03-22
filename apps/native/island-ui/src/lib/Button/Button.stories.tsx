import { storiesOf } from '@storybook/react-native'
import { select, text, withKnobs } from '@storybook/addon-knobs';
import React from 'react'
import { View } from 'react-native';
import { Button } from './Button'
import { theme } from '@island.is/island-ui/theme'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>{children}</View>
)

storiesOf('Button', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('btn a', () => {
    const title = text('Button title', 'Hello button');
    return (
      <Button title={title} onPress={() => void 0} />
    );
  })
  .add('btn b', () => (
    <Button title="Howdy" onPress={() => void 0} />
  ))
