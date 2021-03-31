import { storiesOf } from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs';
import React, { useState } from 'react'
import { View } from 'react-native';
import { Switch } from './Switch'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>{children}</View>
)

storiesOf('Switch', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
      <Switch
        onValueChange={toggleSwitch}
        isEnabled={isEnabled}
      />
    );
  })
