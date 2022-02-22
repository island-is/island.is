import { style } from '@vanilla-extract/css'
import {
  regulationContentStyling,
  diffStyling,
  regulationTitleStyling,
} from '@island.is/regulations/styling'
export const explainerText = style({})

export const layoverModal = style({
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

export const referenceWrapper = style({
  position: 'relative',
})

export const referenceTextContainer = style({
  position: 'sticky',
  top: -2,
  zIndex: 10010,
  height: 0,
})

export const referenceText = style({
  boxSizing: 'content-box',
  position: 'relative',
  marginLeft: 'calc(-50vw + 50%)',
  paddingLeft: 7, // half normal scrollbar width
  width: 'calc(1vw + 1.75em - 7px)',
  height: '100vh',
  overflow: 'hidden',
  border: '2px solid black',
  borderLeft: 0,
  backgroundColor: '#ffffff',
  transition: 'all 300ms 200ms ease-in-out',
  transitionProperty: 'width, max-width',
  boxShadow: '1rem 1rem 2rem rgba(black, 0.15)',
  '::after': {
    content: '',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    boxShadow: 'inset -2rem 0 1rem -1rem rgba(black, 0.2)',
  },
  selectors: {
    '&:hover': {
      width: '45rem',
      maxWidth: '90vw',
    },
    '&:hover:after': {
      content: 'none',
    },
  },
})

export const referenceText__legend = style({
  padding: '0 0.5rem',
  width: '45rem',
  maxWidth: '90vw',
  fontSize: '1.6rem',
  fontWeight: 'bold',
  lineHeight: '3em',
  whiteSpace: 'nowrap',
  backgroundColor: '#eeeeee',
})

export const referenceText__editlink = style({
  fontSize: '0.8rem',
  fontWeight: 'normal',
  float: 'right',
})

export const referenceText__meta = style({
  padding: '0 0.5rem',
  paddingBottom: '0.5rem',
  width: '45rem',
  maxWidth: '90vw',
  borderBottom: '1px solid #dddddd',
  lineHeight: '2rem - 0.5rem',
  backgroundColor: '#eeeeee',
})

export const referenceText__inner = style({
  padding: '1rem',
  width: '45rem',
  maxWidth: '90vw',
  height: 'calc(100vh - 3em)',
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
export const referenceText__appendix = style({
  ...referenceTextAppendixComment,
})
export const referenceText__comments = style({
  ...referenceTextAppendixComment,
})
export const referenceText__appendix__title = style({
  ...referenceTextAppendixCommentTitle,
})
export const referenceText__comments__title = style({
  ...referenceTextAppendixCommentTitle,
})
