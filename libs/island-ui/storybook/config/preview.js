import { addParameters } from '@storybook/react'

import theme from './theme'

addParameters({
  docs: { theme },
  layout: 'padded',
  viewMode: 'docs',
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
})
