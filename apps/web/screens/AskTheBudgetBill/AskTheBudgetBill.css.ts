import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

/**
 * The Zendesk widget sizes itself to fill this container, so it needs an
 * explicit height rather than relying on its content.
 */
export const chatContainer = style({
  width: '100%',
  height: '520px',
  ...themeUtils.responsiveStyle({
    md: {
      height: '640px',
    },
  }),
})

export const chatLoadingOverlay = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
