import { storiesOf } from '@storybook/react-native'
import { text, withKnobs } from '@storybook/addon-knobs';
import React, { useState } from 'react'
import { View, Switch } from 'react-native';
import { SwitchLabel } from './SwitchLabel'
import { theme } from 'libs/island-ui/theme/src';

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>{children}</View>
)

storiesOf('SwitchLabel', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const title = text('Switch labeb', 'Nota FaceID');
    // const [isEnabled, setIsEnabled] = useState(false);
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
      <SwitchLabel title={title}>
        <Switch
          trackColor={{ false: theme.color.dark100, true: theme.color.blue400 }}
          thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </SwitchLabel>
    );
  })
