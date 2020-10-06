import { addDecorator, addParameters } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { withA11y } from '@storybook/addon-a11y'

import storyBookTheme from './storyBookTheme'

addParameters({
  options: { theme: storyBookTheme },
  viewMode: 'docs',
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
})
addDecorator(withKnobs)
addDecorator(withA11y)
