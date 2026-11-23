import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

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

export const emptyStaging = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 120,
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
  cursor: 'pointer',

  selectors: {
    '&[aria-disabled="true"]': {
      cursor: 'default',
      opacity: 0.7,
    },
  },
})

// Div-based table so row borders move with layoutId animations
// (native <tr> borders do not travel with shared-element motion).
export const stagingSection = style({
  marginBottom: theme.spacing[5],
})

export const gridTable = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

export const gridHeader = style({
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.4fr 1.2fr 1.4fr 1.3fr 1fr 48px',
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
  // Keep a stable layout root for shared-element row moves in both directions.
  position: 'relative',
})

export const gridRow = style({
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.4fr 1.2fr 1.4fr 1.3fr 1fr 48px',
  alignItems: 'center',
  // Border lives on the animated row container so it moves with the case.
  borderBottom: `1px solid ${theme.color.blue200}`,
  background: theme.color.white,
})

export const gridCell = style({
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  textAlign: 'left',
  minWidth: 0,
})
