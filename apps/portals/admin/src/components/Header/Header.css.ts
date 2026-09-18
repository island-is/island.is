import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

/** Matches `ModuleSwitcher` (`useBreakpoint().lg`) so lead layout flips with the select. */
const belowLg = `screen and (max-width: ${theme.breakpoints.lg - 1}px)`

export const header = style({
  zIndex: theme.zIndex.header,
  display: 'flex',
  alignItems: 'center',
  height: theme.headerHeight.small,
  backgroundColor: theme.color.blue100,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: theme.headerHeight.large,
    },
  },
  transition: 'all 250ms ease-in-out',
})

/** Compact header used only on translation workspace routes.
 * Height grows at `md` to match `Layout` `workspaceContainer`
 * (not the default header's `lg`).
 */
export const workspaceHeader = style({
  zIndex: theme.zIndex.header,
  display: 'flex',
  alignItems: 'center',
  minHeight: theme.headerHeight.small,
  backgroundColor: theme.color.blue100,
  containerName: 'adminbar',
  containerType: 'inline-size',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      height: theme.headerHeight.large,
      minHeight: theme.headerHeight.large,
    },
  },
})

export const workspaceBar = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'nowrap',
  gap: 12,
  width: '100%',
  minWidth: 0,
  minHeight: theme.headerHeight.small,
  '@container': {
    // Tighten gaps before the trail starts wrapping into the overflow menu.
    'adminbar (max-width: 1240px)': {
      gap: 8,
    },
  },
})

export const lead = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minWidth: 0,
  flex: '1 1 auto',
  overflow: 'hidden',
  '@container': {
    'adminbar (max-width: 1240px)': {
      gap: 8,
    },
  },
  '@media': {
    [belowLg]: {
      gap: 0,
    },
  },
})

export const switcher = style({
  minWidth: 0,
  flex: '1 1 auto',
  overflow: 'hidden',
  '@media': {
    [belowLg]: {
      order: 2,
    },
  },
})

/** Keep the fixed-width desktop switcher inside the shrinking lead slot. */
globalStyle(`${switcher} > div`, {
  width: '100%',
  maxWidth: 290,
  marginLeft: 0,
})

export const trail = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginLeft: 'auto',
  flex: '0 0 auto',
  '@media': {
    print: {
      display: 'none',
    },
  },
})
