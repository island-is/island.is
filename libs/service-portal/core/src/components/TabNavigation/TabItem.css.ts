import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tab = style({
  height: '100%',
  width: '100%',
  position: 'relative',
  minHeight: `${theme.spacing[7]}px`,
  fontWeight: theme.typography.light,
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.color.white}`,
  ':focus': {
    zIndex: 5,
  },
})

export const tabSelected = style({
  fontWeight: theme.typography.semiBold,
  color: theme.color.blue400,
  background: `linear-gradient(180deg, ${theme.color.transparent} 50%, ${theme.color.white} 50%)`,
  ':hover': {
    borderBottomColor: theme.color.white,
  },
  ':after': {
    backgroundColor: theme.color.white,
    position: 'absolute',
    content: '',
    height: '50%',
    width: 'calc(100% + 2px)',
    top: 0,
    border: `1px solid ${theme.color.blue200}`,
    borderBottom: 'none',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    pointerEvents: 'none',
  },
})

export const firstTab = style({})
export const lastTab = style({})

export const tabNextToSelectedTab = style({
  ':hover': {
    borderBottomColor: theme.color.white,
  },
  ':after': {
    position: 'absolute',
    content: '',
    height: 'calc(50% + 1px)',
    width: '100%',
    bottom: -1,
    border: `1px solid ${theme.color.blue200}`,
    borderRight: 'none',
    borderTop: 'none',
    borderBottomLeftRadius: 10,
    pointerEvents: 'none',
    zIndex: 3,
  },
})

export const tabPreviousToSelectedTab = style({
  ':hover': {
    borderBottomColor: theme.color.white,
  },
  ':after': {
    position: 'absolute',
    content: '',
    height: 'calc(50% + 1px)',
    width: '100%',
    bottom: -1,
    border: `1px solid ${theme.color.blue200}`,
    borderTop: 'none',
    borderLeft: 'none',
    borderBottomRightRadius: 10,
    pointerEvents: 'none',
    zIndex: 3,
  },
})

export const tabNotSelected = style({
  borderBottomColor: theme.color.blue200,
  ':hover': {
    borderBottomColor: theme.color.blue400,
  },
})

export const tabText = style({
  zIndex: theme.zIndex.above,
})

export const tabElement = style({})
export const borderElement = style({})

//Underlines when hovering unselected tabs
globalStyle(`${tabNextToSelectedTab}:hover ${borderElement}:after`, {
  position: 'absolute',
  content: '',
  height: '1px',
  width: '90%',
  bottom: -1,
  left: 0,
  right: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
  background: theme.color.blue400,
  zIndex: 5,
})

globalStyle(`${tabPreviousToSelectedTab}:hover ${borderElement}:after`, {
  position: 'absolute',
  content: '',
  height: '1px',
  width: '90%',
  bottom: -1,
  left: 0,
  right: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
  background: theme.color.blue400,
  zIndex: 5,
})

globalStyle(
  `${tabPreviousToSelectedTab}:first-of-type:hover ${borderElement}:after`,
  {
    position: 'absolute',
    content: '',
    height: '1px',
    width: '90%',
    bottom: -1,
    left: 0,
    background: theme.color.blue400,
    zIndex: 5,
  },
)

globalStyle(
  `${tabNextToSelectedTab}:last-of-type:hover ${borderElement}:after`,
  {
    position: 'absolute',
    content: '',
    height: '1px',
    width: '90%',
    bottom: -1,
    right: 0,
    background: theme.color.blue400,
    zIndex: 5,
  },
)

//For styling edges if selected first or last
globalStyle(`${tabSelected}:first-of-type span:before`, {
  backgroundColor: theme.color.blue200,
  position: 'absolute',
  content: '',
  height: 'calc(50% + 1px)',
  width: '1px',
  bottom: 0,
  left: -1,
})

globalStyle(`${tabSelected}:last-of-type span:before`, {
  backgroundColor: theme.color.blue200,
  position: 'absolute',
  content: '',
  height: 'calc(50% + 1px)',
  width: '1px',
  bottom: 0,
  right: -1,
})

// Globals for styling the corners of the selected tab
//top left if selected, block the background
globalStyle(`${tabSelected}:first-of-type ${tabElement}:after`, {
  position: 'absolute',
  content: '',
  top: 0,
  left: 0,
  width: '10px',
  height: '10px',
  background: theme.color.white,
})

//top right if selected, block the background
globalStyle(`${tabSelected}:last-of-type ${tabElement}:before`, {
  position: 'absolute',
  content: '',
  top: 0,
  right: 0,
  width: '10px',
  height: '10px',
  background: theme.color.white,
})

//right square
globalStyle(`${tabPreviousToSelectedTab}:not(:last-of-type) span:after`, {
  position: 'absolute',
  content: '',
  bottom: 0,
  right: 0,
  width: '10px',
  height: '10px',
  background: theme.color.white,
  zIndex: 1,
})

//left square
globalStyle(`${tabNextToSelectedTab}:not(:first-of-type) span:before`, {
  position: 'absolute',
  content: '',
  bottom: 0,
  left: 0,
  width: '10px',
  height: '10px',
  background: theme.color.white,
  zIndex: 1,
})

//right circle
globalStyle(
  `${tabPreviousToSelectedTab}:not(:last-of-type) ${tabElement}:after`,
  {
    position: 'absolute',
    content: '',
    bottom: 0,
    right: 0,
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    background: theme.color.blue100,
    zIndex: 2,
  },
)

//left circle
globalStyle(
  `${tabNextToSelectedTab}:not(:first-of-type) ${tabElement}:before`,
  {
    position: 'absolute',
    content: '',
    bottom: 0,
    left: 0,
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    background: theme.color.blue100,
    zIndex: 2,
  },
)

globalStyle(`${tabNotSelected}:hover span`, {
  color: theme.color.blue400,
})
