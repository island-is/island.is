import { addons } from '@storybook/addons'
import { DOCS_RENDERED, STORY_RENDERED } from '@storybook/core-events'

import theme from '../theme'

addons.register('island-ui/title', (api) => {
  const updateTitle = () => {
    const storyData = api.getCurrentStoryData()

    document.title = `${storyData.kind} — ${theme.brandTitle}`
  }

  api.on(DOCS_RENDERED, updateTitle)
  api.on(STORY_RENDERED, updateTitle)
})
