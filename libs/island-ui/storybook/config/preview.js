import { addDecorator, addParameters } from '@storybook/react'

import { Providers } from './Providers'
import theme from './theme'

addParameters({
  docs: { theme },
  layout: 'padded',
  viewMode: 'docs',
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
})

addDecorator(Providers)
