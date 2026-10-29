import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  minHeight: '-webkit-fill-available',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minHeight: `calc(100vh - ${theme.headerHeight.large}px)`,
    },
  },
})

/**
 * Locks the translation workspace to the viewport so only inner panes scroll.
 * Header subtraction uses `md` to match `workspaceHeader` (not the default
 * admin header, which grows at `lg`).
 */
export const workspaceContainer = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '-webkit-fill-available',
  height: `calc(100vh - ${theme.headerHeight.small}px)`,
  maxHeight: `calc(100vh - ${theme.headerHeight.small}px)`,
  overflow: 'hidden',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      height: `calc(100vh - ${theme.headerHeight.large}px)`,
      maxHeight: `calc(100vh - ${theme.headerHeight.large}px)`,
    },
  },
})

/** Stretch `ModuleRoute`'s padding wrapper so the workspace can fill it. */
globalStyle(`${workspaceContainer} > *`, {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
})

export const contentBox = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minHeight: `calc(100vh - ${theme.headerHeight.large}px - 2 * ${theme.spacing[5]}px)`,
    },
  },
})
