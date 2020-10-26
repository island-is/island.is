import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  width: 432,
  minHeight: 163,
  marginBottom: 24,
  marginRight: 24,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  ':hover': {
    borderColor: theme.color.blue400,
    textDecoration: 'none',
  },
})

export const cardMobile = style({
  width: 327,
  minHeight: 163,
  marginBottom: 20,
  marginRight: 20,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  ':hover': {
    borderColor: theme.color.blue400,
    textDecoration: 'none',
  },
})

export const name = style({
  fontSize: 24,
  color: theme.color.blue400,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  ':hover': {
    overflow: 'visible',
    whiteSpace: 'normal',
  },
})

export const owner = style({
  fontSize: 18,
  color: theme.color.dark400,
  fontWeight: 300,
  paddingTop: 2,
})

export const nameMobile = style({
  fontSize: 20,
  color: theme.color.blue400,
  fontWeight: 600,
})

export const ownerMobile = style({
  fontSize: 16,
  color: theme.color.dark400,
  fontWeight: 300,
  paddingTop: 2,
})

export const serviceStatus = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'flex-end',
  right: '3%',
  top: -75,
})

const globalItems = {
  paddingLeft: 32,
  paddingRight: 32,
  paddingTop: 24,
  paddingBottom: 24,
}

export const scrollBoxWrapper = style({
  width: '98%',
  height: '100%',
  overflowY: 'hidden',
  overflowX: 'hidden',
  borderBottomLeftRadius: 7,
  paddingLeft: globalItems.paddingLeft,
})

export const category = style({
  width: '100%',
  display: 'inline-flex',
  background: theme.color.white,
  borderBottomLeftRadius: 7,
  borderBottomRightRadius: 7,
  paddingTop: 5,
  paddingBottom: 2,
  fontWeight: 600,
})

export const categoryItem = style({
  color: theme.color.blue400,
  background: theme.color.blue100,
  borderRadius: 5,
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 8,
  paddingRight: 8,
  fontSize: 12,
  minWidth: 40,
  marginRight: 8,
  marginBottom: 3,
  display: 'flex',
  flexShrink: 0,
})

export const noSelect = style({
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
})

export const notDraggable = style({
  userSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  MozWindowDragging: 'no-drag',
})

export const cardTexts = style({
  paddingLeft: globalItems.paddingLeft,
  paddingTop: globalItems.paddingTop,
})
