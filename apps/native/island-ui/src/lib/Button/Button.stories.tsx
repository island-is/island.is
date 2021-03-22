import { storiesOf } from '@storybook/react-native'
import { select, withKnobs } from '@storybook/addon-knobs';
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
    const backgroundColor = select('hello world', theme.color, theme.color.blue300);
    console.log({ backgroundColor });
    return (
      <Button title={backgroundColor} onPress={() => console.log('pressed button')} style={backgroundColor} />
  })
  .add('btn b', () => (
    <Button title="Button 2" onPress={() => console.log('pressed button')} />
  ))
