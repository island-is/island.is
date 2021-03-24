import { storiesOf } from '@storybook/react-native';
import { text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { View } from 'react-native';
import { Alert, AlertType } from './Alert';

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>{children}</View>
)

storiesOf('Alert', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const type = 'error';
    const title = text('Alert title', 'Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?');
    const message = text('Alert description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in');

    return (
      <Alert type={type} title={title} message={message} />
    );
  })
