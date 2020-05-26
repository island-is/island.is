import { addDecorator, addParameters } from '@storybook/react'
import storyBookTheme from './storyBookTheme'
import { withKnobs } from '@storybook/addon-knobs'
import { withA11y } from '@storybook/addon-a11y'

addParameters({
  options: {
    theme: storyBookTheme,
  },
})
addDecorator(withKnobs)
addDecorator(withA11y)
