import { configure, getStorybookUI } from '@storybook/react-native'
import React from 'react'
import { Platform } from 'react-native'

configure(() => {
  // require('../../../../island-ui/src/lib/button/button.stories')
  // require('../../../../island-ui/src/lib/badge/badge.stories')
  // require('../../../../island-ui/src/lib/bubble/bubble.stories')
  // require('../../../../island-ui/src/lib/card/card.stories')
  // require('../../../../island-ui/src/lib/alert/alert.stories')
  // require('../../../../island-ui/src/lib/input/input.stories')
  // require('../../../../island-ui/src/lib/heading/heading.stories')
  // require('../../../../island-ui/src/lib/list/list.stories')
  // require('../../../../island-ui/src/lib/field/field.stories')
  // require('../../../../island-ui/src/lib/tableview/tableview.stories')
  // require('../../../../island-ui/src/lib/navigation-bar-sheet/navigation-bar-sheet.stories')
  // require('../../../../island-ui/src/lib/view-pager/view-pager.stories')
  // require('../../../../island-ui/src/lib/tab-bar/tab-bar.stories')
  // require('../../../../island-ui/src/lib/search-bar/search-bar.stories')
  // require('../../../../island-ui/src/lib/empty-state/empty-state.stories')
  // require('../../../../island-ui/src/lib/loader/loader.stories')
  // require('../../../../island-ui/src/lib/onboarding/onboarding.stories')
  // require('../../../../island-ui/src/lib/search-header/search-header.stories')
  // require('../../../../island-ui/src/lib/skeleton/skeleton.stories')
  // require('../../../../island-ui/src/lib/link/link.stories')
  // require('../../../../island-ui/src/lib/scan-result-card/scan-result-card.stories')
}, module)

export const StorybookUI = getStorybookUI({
  host: Platform.OS === 'android' ? '10.0.2.2' : '0.0.0.0',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  asyncStorage: require('@react-native-async-storage/async-storage').default,
})

export const StorybookScreen = () => {
  return <StorybookUI />
}

StorybookScreen.options = {
  topBar: {
    title: {
      text: 'Storybook',
    },
  },
}
