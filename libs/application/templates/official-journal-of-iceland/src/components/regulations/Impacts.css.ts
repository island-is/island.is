/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/Impacts.css.ts
 *
 * Styles for the regulation impact components within the OJOI application.
 */
import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const layoverModal = style({
  overflow: 'hidden',
  backgroundColor: 'white',
  width: 'calc(100% - 40px)',
  height: 'calc(100% - 40px)',
  overflowY: 'auto',
  margin: 20,
})

export const editBox = style({
  backgroundColor: '#FBFBFB',
  border: '1px solid #E7E7E7',
})

export const border = style({
  maxWidth: 'fit-content',
  paddingBottom: theme.spacing[1],
  marginBottom: theme.spacing[3],
})

export const line = style({
  width: 1,
  height: theme.spacing[3],
  background: theme.color.dark200,
})

export const history = style({
  gap: theme.spacing[4],
})

export const amendingSelectionOption = style({})

globalStyle(
  `${amendingSelectionOption} #asyncsearch-id-menu li:not([disabled])`,
  {
    cursor: 'pointer',
  },
)
