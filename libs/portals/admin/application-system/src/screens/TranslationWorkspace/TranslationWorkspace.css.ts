import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

/**
 * Locks workspace height to fill the viewport below the header so both the
 * preview and nav panels scroll independently. The `::after` pseudo-element
 * provides the white background that covers the nav column area edge-to-edge.
 */
/**
 * The portal `ModuleRoute` wrapper adds `paddingY={1}` (8px) around every
 * route. Negative margins pull the workspace shell back into that padding so
 * the layout fills the viewport edge-to-edge below the header.
 */
const moduleRoutePad = theme.spacing[1]

export const workspaceShell = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: 0,
  position: 'relative',
  marginTop: -moduleRoutePad,
  marginBottom: -moduleRoutePad,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      height: `calc(100vh - ${theme.headerHeight.large}px)`,
      selectors: {
        '&::after': {
          content: '',
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '400px',
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
  width: '100%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'flex',
      flex: '1 1 0%',
      minHeight: 0,
      overflow: 'visible',
    },
  },
})

export const workspacePreviewAside = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flex: '1 1 0%',
      minWidth: 0,
      minHeight: 0,
      height: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
    },
  },
})

export const workspaceNavAside = style({
  position: 'relative',
  zIndex: 1,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flex: '0 0 800px',
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  },
})
