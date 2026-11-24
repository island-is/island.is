import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const GRID_COLUMNS = '1.2fr 1.4fr 1.2fr 1.4fr 1.3fr 1fr 48px'

export const logoContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[5],
})

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing[2],
  marginBottom: theme.spacing[3],
})

// Absolutely fills gridBody (which sets minHeight while empty) so fade-out
// does not collapse the section before the first row is in the flow.
export const emptyStaging = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing[3],
  border: `1px dashed ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
})

export const stringGroupItem = style({
  display: 'flex',
  alignItems: 'center',
  columnGap: '4px',
})

export const selectableRow = style({
  cursor: 'grab',
  touchAction: 'none',

  selectors: {
    '&[aria-disabled="true"]': {
      cursor: 'default',
      opacity: 0.7,
      touchAction: 'auto',
    },
  },
})

// Margin is animated on the motion wrapper (open/collapse with the section).
export const stagingSection = style({
  width: '100%',
})

export const gridTable = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

export const gridHeader = style({
  display: 'grid',
  gridTemplateColumns: GRID_COLUMNS,
  alignItems: 'center',
  background: theme.color.blue100,
  borderBottom: `1px solid ${theme.color.blue200}`,
})

export const gridHeaderCell = style({
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  whiteSpace: 'nowrap',
  textAlign: 'left',
})

export const gridBody = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  minHeight: 8,
})

export const gridRow = style({
  display: 'grid',
  gridTemplateColumns: GRID_COLUMNS,
  alignItems: 'center',
  borderBottom: `1px solid ${theme.color.blue200}`,
  background: theme.color.white,
})

export const gridRowDragging = style({
  opacity: 0.35,
})

export const gridCell = style({
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  textAlign: 'left',
  minWidth: 0,
})

export const menuCell = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: theme.spacing[2],
})

export const contextMenuButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: theme.border.radius.large,
  cursor: 'pointer',
  transition: 'background-color .2s',

  selectors: {
    '&:hover, &[aria-expanded="true"]': {
      backgroundColor: theme.color.blue200,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 ${theme.border.width.large}px ${theme.border.color.focus}`,
    },
  },
})

export const dragPreviewMotion = style({
  width: 'min(1344px, 92vw)',
  transformOrigin: '50% 50%',
  pointerEvents: 'none',
})

// Portaled click-to-move clone — sits above list overflow so the row stays visible in flight.
export const clickFlight = style({
  position: 'fixed',
  zIndex: 10000,
  pointerEvents: 'none',
  margin: 0,
  background: theme.color.white,
  boxShadow: '0 8px 24px rgba(0, 61, 153, 0.16)',
})

export const dragPreview = style({
  display: 'grid',
  gridTemplateColumns: GRID_COLUMNS,
  alignItems: 'center',
  width: '100%',
  borderRadius: theme.border.radius.large,
  border: `1px solid ${theme.color.blue200}`,
  background: theme.color.white,
  boxShadow: '0 12px 28px rgba(0, 61, 153, 0.18)',
  cursor: 'grabbing',
  pointerEvents: 'none',
})
