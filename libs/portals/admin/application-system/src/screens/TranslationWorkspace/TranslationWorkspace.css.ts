import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

/**
 * Side-by-side preview + nav from `xl`. Below that the nav is a right-edge
 * drawer so the panel is never squeezed into a narrow column.
 */
const desktop = `screen and (min-width: ${theme.breakpoints.xl}px)`
const compact = `screen and (max-width: ${theme.breakpoints.xl - 1}px)`

const compactNavWidth = 'min(420px, 90vw)'
const drawerHandleWidth = 16
const drawerHandleHitWidth = 44
const drawerHandleHeight = 96

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
  overflow: 'visible',
  '@media': {
    [desktop]: {
      overflow: 'hidden',
    },
  },
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
  position: 'relative',
  zIndex: 1,
  '@media': {
    [compact]: {
      position: 'fixed',
      top: theme.headerHeight.small,
      right: 0,
      bottom: 0,
      width: compactNavWidth,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'visible',
      backgroundColor: theme.color.white,
      transform: 'translate3d(100%, 0, 0)',
      transition: 'transform 400ms ease-in-out',
      pointerEvents: 'none',
      zIndex: theme.zIndex.belowHeader,
    },
    [`screen and (min-width: ${theme.breakpoints.md}px) and (max-width: ${
      theme.breakpoints.xl - 1
    }px)`]: {
      top: theme.headerHeight.large,
    },
    [desktop]: {
      flex: '0 0 30vw',
      maxWidth: '30vw',
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  },
  selectors: {
    [`${workspaceShell}[data-nav-drawer-open="true"] &`]: {
      transform: 'translate3d(0, 0, 0)',
      pointerEvents: 'auto',
      boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
    },
  },
})

export const navDrawerBackdrop = style({
  display: 'none',
  '@media': {
    [compact]: {
      display: 'block',
      position: 'fixed',
      inset: 0,
      border: 0,
      padding: 0,
      margin: 0,
      backgroundColor: 'rgba(0, 24, 51, 0.25)',
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 400ms ease-in-out',
      cursor: 'pointer',
      appearance: 'none',
      outline: 'none',
    },
  },
  selectors: {
    [`${workspaceShell}[data-nav-drawer-open="true"] &`]: {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
})

export const navDrawerToggle = style({
  display: 'none',
  '@media': {
    [compact]: {
      display: 'flex',
      position: 'absolute',
      top: theme.spacing[3],
      left: -drawerHandleHitWidth,
      zIndex: 2,
      pointerEvents: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      width: drawerHandleHitWidth,
      height: drawerHandleHeight,
      padding: 0,
      border: 0,
      cursor: 'pointer',
      backgroundColor: 'transparent',
      selectors: {
        '&::after': {
          content: '',
          position: 'absolute',
          top: 0,
          right: 0,
          width: drawerHandleWidth,
          height: '100%',
          backgroundColor: theme.color.white,
          borderRadius: `${theme.border.radius.large} 0 0 ${theme.border.radius.large}`,
          boxShadow: '-2px 2px 16px rgba(0, 97, 255, 0.12)',
          pointerEvents: 'none',
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.color.blue400}`,
          outlineOffset: 2,
        },
      },
    },
  },
})

export const navDrawerToggleGrip = style({
  position: 'absolute',
  right: (drawerHandleWidth - 4) / 2,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  width: 4,
  height: 42,
  borderRadius: 2,
  backgroundColor: theme.color.blue300,
  pointerEvents: 'none',
})

/** Fills the nav column / drawer so the tabs panel can scroll inside. */
export const navDrawerPanel = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 0%',
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  overflow: 'hidden',
})
