import { addParameters } from '@storybook/react'
import storyBookTheme from './storyBookTheme'

addParameters({
  options: {
    theme: storyBookTheme,
  },
  layout: 'padded',
  viewMode: 'docs',
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
})
