/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/Impacts.css.ts
 * (referenceText* styles)
 *
 * CSS for the slide-in reference text panel that appears on the left side
 * of the EditChange modal. Shows fully on hover.
 */
import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import {
  regulationContentStyling,
  diffStyling,
} from '@island.is/regulations/styling'

export const referenceTextContainer = style({
  position: 'fixed',
  top: '2vh',
  zIndex: 10010,
  height: 0,
  transition: 'all 300ms 200ms ease-in-out',
  transitionProperty: 'transform',
  width: '45rem',
  maxWidth: '90vw',
  right: '50%',
  transform: 'translateX(calc(-50vw + 5%))',

  selectors: {
    '&:hover': {
      transform: 'translateX(calc(-50vw + 101%))',
    },
  },
})

export const referenceText = style({
  height: '96vh',
  overflow: 'hidden',
  borderRadius: theme.border.radius.standard,
  border: `1px solid ${theme.color.dark200}`,
  backgroundColor: '#ffffff',
  boxShadow: '1rem 1rem 2rem rgba(0, 0, 0, 0.15)',
})

export const referenceTextLegend = style({
  padding: theme.spacing[3],
  width: '45rem',
  maxWidth: '90vw',
  fontSize: '1.6rem',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  backgroundColor: theme.color.dark100,
})

export const referenceTextTitle = style({
  marginBottom: '1rem',
  fontSize: '1.4rem',
  fontWeight: 600,
})

export const referenceTextInner = style({
  padding: theme.spacing[2],
  width: '45rem',
  maxWidth: '90vw',
  height: '80vh',
  overflowY: 'auto',
  borderBottom: '0.5rem solid transparent',
})

export const referenceTextBody = style({})
regulationContentStyling(referenceTextBody)
diffStyling(referenceTextBody)

export const referenceTextAppendix = style({
  marginTop: '2rem',
  paddingTop: '1rem',
  borderTop: '1px solid #dedede',
})

export const referenceTextAppendixTitle = style({
  marginBottom: '0.5em',
  fontSize: '1.5em',
  fontWeight: 700,
})
