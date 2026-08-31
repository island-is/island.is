import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

/**
 * Side-by-side preview + nav from `xl`. Below that the nav is an island-ui
 * Drawer so the panel is never squeezed into a narrow column.
 */
const desktop = `screen and (min-width: ${theme.breakpoints.xl}px)`

/**
 * Fills the layout `workspaceContainer` below the header so preview and nav
 * panes scroll independently. `::after` paints the desktop nav column
 * background edge-to-edge. `ModuleRoute` adds `paddingY={1}` (8px); negative
 * margins + extra height cancel that padding.
 */
const moduleRoutePad = theme.spacing[1]

export const workspaceShell = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flex: '1 1 0%',
  minHeight: 0,
  position: 'relative',
  marginTop: -moduleRoutePad,
  marginBottom: -moduleRoutePad,
  height: `calc(100% + ${moduleRoutePad * 2}px)`,
  '@media': {
    [desktop]: {
      selectors: {
        '&::after': {
          content: '',
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '30vw',
          backgroundColor: theme.color.white,
          zIndex: 0,
          pointerEvents: 'none',
        },
      },
    },
  },
})

globalStyle(`${workspaceShell} > *`, {
  position: 'relative',
  zIndex: 1,
})

export const workspaceMainRow = style({
  display: 'flex',
  flex: '1 1 0%',
  width: '100%',
  minHeight: 0,
  overflow: 'hidden',
})

export const workspacePreviewAside = style({
  flex: '1 1 0%',
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
})

export const publishConfirmModal = style({
  position: 'relative',
  maxWidth: `calc(100% - ${theme.spacing[6]}px)`,
  maxHeight: `calc(100% - ${theme.spacing[6]}px)`,
  margin: 'auto',
  marginTop: '25vh',
  borderRadius: theme.border.radius.large,
  overflowY: 'auto',
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  ...themeUtils.responsiveStyle({
    md: {
      width: 600,
    },
  }),
})

export const workspaceNavAside = style({
  flex: '0 0 30vw',
  maxWidth: '30vw',
  height: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

/** Overrides default Drawer width (80% / 902px) for the translation panel. */
export const navDrawerPanel = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      width: 420,
    },
    lg: {
      width: 420,
    },
  }),
})

/** Clears the Drawer's close button and lets the tabs panel fill remaining height. */
export const navDrawerContent = style({
  paddingTop: theme.spacing[10],
  overflow: 'hidden',
})

export const navDrawerOpenButton = style({
  position: 'fixed',
  zIndex: theme.zIndex.belowHeader,
  top: theme.headerHeight.small + theme.spacing[2],
  right: theme.spacing[2],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      top: theme.headerHeight.large + theme.spacing[2],
    },
  },
})

/** Fills the desktop nav column so the tabs panel can scroll inside. */
export const navColumn = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 0%',
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  overflow: 'hidden',
})
