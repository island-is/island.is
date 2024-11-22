import { globalStyle, style } from '@vanilla-extract/css'
import { diffStyling } from '@island.is/regulations/styling'
import { theme } from '@island.is/island-ui/theme'

export const explainerText = style({})

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

export const diff = style({})
diffStyling(diff)

export const diffButton = style({
  position: 'absolute',
})

export const referenceWrapper = style({
  position: 'relative',
})

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
  borderRadius: theme.border.radius.xs,
  border: `1px solid ${theme.color.dark200}`,
  backgroundColor: '#ffffff',
  boxShadow: '1rem 1rem 2rem rgba(black, 0.15)',
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

export const referenceTextEditlink = style({
  fontSize: '0.8rem',
  fontWeight: 'normal',
  float: 'right',
})

export const referenceTextMeta = style({
  padding: theme.spacing[3],
  paddingTop: 0,
  width: '45rem',
  maxWidth: '90vw',
  borderBottom: `1px solid ${theme.color.dark200}`,
  backgroundColor: theme.color.dark100,
})

export const referenceTextInner = style({
  padding: theme.spacing[2],
  width: '45rem',
  maxWidth: '90vw',
  // FIXME: Simplify use flexbox to make this strecth to fill the available space.
  height: '80vh',
  overflowY: 'auto',
  borderBottom: '0.5rem solid transparent', // hack for getting overflow padding-bottom in FF
})

const referenceTextAppendixComment = {
  marginTop: '2rem',
  paddingTop: '1rem',
  borderTop: '1px solid #dedede;',
}

const referenceTextAppendixCommentTitle = {
  marginBottom: '0.5em',
  fontSize: '1.5em',
  fontWeigth: 700,
}
export const referenceTextAppendix = style({
  ...referenceTextAppendixComment,
})
export const referenceTextComments = style({
  ...referenceTextAppendixComment,
})
export const referenceTextAppendixTitle = style({
  ...referenceTextAppendixCommentTitle,
})
export const referenceTextCommentsTitle = style({
  ...referenceTextAppendixCommentTitle,
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
