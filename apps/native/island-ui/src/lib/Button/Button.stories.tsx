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
      <Button backgroundColor={backgroundColor}>{backgroundColor}</Button>
    );
  })
  .add('btn b', () => (
    <Button>hi 2</Button>
  ))
