import { style, styleVariants, globalStyle } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import * as mixins from '../Input/Input.mixins'

export const root = style({
  position: 'relative',
  minWidth: '250px',
})

export const backgroundBlue = style({
  selectors: {
    [`${root} &`]: {
      backgroundColor: `${theme.color.blue100} !important`,
    },
  },
})

export const small = style({})
export const extraSmall = style({})

export const inputContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTopRightRadius: 8,
  borderTopLeftRadius: 8,
  padding: '7px 23px 13px 7px',
  width: '100%',
  outline: 'none',
  backgroundColor: theme.color.white,
  border: `1px solid transparent`,
  lineHeight: 'inherit',

  ':active': {
    boxShadow: '0 0 0 3px transparent',
  },
  ':focus': {
    boxShadow: `0 0 0 3px ${theme.color.mint400}`,
  },
})

export const inputContainerVariants = styleVariants({
  open: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  closed: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    border: `1px solid ${theme.color.blue200}`,
    ':hover': {
      borderColor: theme.color.blue400,
    },
  },
})

export const hasError = style({
  border: `1px solid ${theme.color.red600}`,

  ':hover': {
    borderColor: theme.color.blue400,
  },
})

export const errorMessage = style(mixins.errorMessage)

export const labelAndPlaceholderContainer = style({
  textAlign: 'left',
})

export const label = style({
  display: 'block',
  width: '100%',
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
  fontSize: 14,
  marginBottom: theme.spacing[1],
  transition: 'color 0.1s',
})

export const requiredStar = style({
  color: theme.color.red600,
})

export const labelError = style({
  color: theme.color.red600,
})

export const value = style({
  padding: `0 ${theme.spacing[2]}px`,
})

export const customHeaderContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.color.blue200}`,
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
  marginBottom: theme.spacing[2],
  position: 'relative',
  '::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    height: '1px',
    left: `-${theme.spacing[3] - 3}px`,
    right: `-${theme.spacing[3] - 3}px`,
    background: theme.color.blue200,
  },
})

export const headerSelect = style({
  border: 'none',
  appearance: 'none',
  fontSize: 18,
  fontWeight: 600,
  backgroundColor: theme.color.transparent,
  padding: 0,
  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 20,
    },
  }),
})

export const decreaseButton = style({
  outline: 'none',
  display: 'flex',
  alignItems: 'center',

  ':focus': {
    boxShadow: `0 0 0 3px ${theme.color.mint400}`,
  },
})

export const increaseButton = style({
  outline: 'none',
  display: 'flex',
  alignItems: 'center',

  ':focus': {
    boxShadow: `0 0 0 3px ${theme.color.mint400}`,
  },
})

export const popper = style({
  marginTop: '0',
  right: '0',
  width: '100%',
  top: '65px !important',
  padding: '0 !important',
  ...themeUtils.responsiveStyle({
    md: {
      top: '70px !important',
    },
  }),
})

export const popperXsmall = style({
  top: '51px !important',
  ...themeUtils.responsiveStyle({
    md: {
      top: '65px !important',
    },
  }),
})

export const popperSmall = style({
  top: '51px !important',
  ...themeUtils.responsiveStyle({
    md: {
      top: '-7px !important',
    },
  }),
})

export const popperSmallWithoutLabel = style({
  top: '42px !important',
  ...themeUtils.responsiveStyle({
    md: {
      top: '42px !important',
    },
  }),
})

export const popperWithoutLabel = style({
  top: '52px !important',
  ...themeUtils.responsiveStyle({
    md: {
      top: '52px !important',
    },
  }),
})

export const popperInline = style({
  position: `relative !important` as never,
  transform: 'none !important',
  marginBottom: '-7px',
})

// Overwrite default ReactDatepicker styles
globalStyle(`${root}.island-ui-datepicker .react-datepicker`, {
  display: 'block',
  borderTopRightRadius: '0',
  borderTopLeftRadius: '0',
  borderBottomRightRadius: '8px',
  borderBottomLeftRadius: '8px',
  boxShadow: `inset -3px -3px 0px ${theme.color.mint400}, inset 3px -3px 0px ${theme.color.mint400}`,
  border: 'none',
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  paddingTop: 0,
})

globalStyle(`${root}.island-ui-datepicker .react-datepicker-wrapper`, {
  display: 'block',
})

globalStyle(
  `${root}.island-ui-datepicker${root}.island-ui-datepicker .react-datepicker__header`,
  {
    fontFamily: 'IBM Plex Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    backgroundColor: `${theme.color.transparent}`,
    borderBottom: 'none',
    paddingBottom: '0',
  },
)

globalStyle(`${root}.island-ui-datepicker .react-datepicker__month-container`, {
  float: 'none',
})
globalStyle(`${root}.island-ui-datepicker .react-datepicker__month`, {
  margin: `0`,
})
globalStyle(`${root}.island-ui-datepicker .react-datepicker__day-names`, {
  marginBottom: '3px',
})

globalStyle(`${root} .react-datepicker__day-names, .react-datepicker__week`, {
  display: 'flex',
  justifyContent: 'space-between',
})

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker__day-name, .react-datepicker__day`,
  {
    fontFamily: 'IBM Plex Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: `${theme.typography.baseFontSize}px`,
    lineHeight: `${theme.typography.baseLineHeight}`,
    textAlign: 'center',
    color: `${theme.color.dark400}`,
  },
)

globalStyle(`${root}.island-ui-datepicker .react-datepicker__day--disabled`, {
  color: `${theme.color.dark200} !important`,
})

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker__day--disabled:hover`,
  {
    borderColor: 'transparent !important',
    background: 'transparent !important',
  },
)

globalStyle(`${root}.island-ui-datepicker .react-datepicker__day`, {
  fontFamily: 'IBM Plex Sans',
  fontStyle: 'normal',
  fontWeight: 300,
  fontSize: `${theme.typography.baseFontSize}px`,
  lineHeight: `${theme.typography.baseLineHeight}`,
  textAlign: 'center',
  color: `${theme.color.dark400}`,
  border: '1px solid transparent',
  borderRadius: '5px',
  outline: 'none !important',
  transition: 'border-color 0.3s, color 0.3s',
})

globalStyle(`${root}.island-ui-datepicker .react-datepicker__day:hover`, {
  background: `${theme.color.blue100}`,
  borderColor: `${theme.color.blue400}`,
})

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker__day--selected, .react-datepicker__day--selected:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover, .react-datepicker__day--keyboard-selected`,
  {
    background: `${theme.color.blue400} !important`,
    color: `${theme.color.white} !important`,
  },
)

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker-popper[data-placement^="top"]`,
  {
    top: '11px !important',
  },
)

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker-popper[data-placement^="bottom"]`,
  {
    top: '-7px !important',
  },
)

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker-popper[data-placement^="top"] .react-datepicker`,
  {
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
    borderBottomRightRadius: '0',
    borderBottomLeftRadius: '0',
    boxShadow: `inset -3px 0px 0px ${theme.color.mint400}, inset 3px 0px 0px ${theme.color.mint400}, inset -1px 3px 0px ${theme.color.mint400}`,
  },
)

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker-popper[data-placement^="top"] .react-datepicker__header--custom .date-picker-custom-header`,
  {
    borderTop: 0,
  },
)
