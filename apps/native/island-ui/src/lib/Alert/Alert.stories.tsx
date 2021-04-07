import { storiesOf } from '@storybook/react-native';
import { text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { View } from 'react-native';
import { Alert } from './Alert';

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>{children}</View>
)

storiesOf('Alert', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Error', () => {
    const title = text('Alert title', 'Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?');
    const message = text('Alert meassage', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in');

    return (
      <Alert type="error" title={title} message={message} />
    );
  })
  .add('Info', () => {
    const title = text('Alert title', 'Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?');
    const message = text('Alert meassage', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in');

    return (
      <Alert type="info" title={title} message={message} />
    );
  })
  .add('Success', () => {
    const title = text('Alert title', 'Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?');
    const message = text('Alert meassage', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in');

    return (
      <Alert type="success" title={title} message={message} />
    );
  })
  .add('Warning', () => {
    const title = text('Alert title', 'Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?');
    const message = text('Alert meassage', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in');

    return (
      <Alert type="warning" title={title} message={message} />
    );
  })
