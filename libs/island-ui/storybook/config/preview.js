import { addDecorator, addParameters } from '@storybook/react';
import storyBookTheme from './storyBookTheme'
import { withKnobs } from '@storybook/addon-knobs';

addParameters({
  options: {
    theme: storyBookTheme
  }
})
addDecorator(withKnobs);
