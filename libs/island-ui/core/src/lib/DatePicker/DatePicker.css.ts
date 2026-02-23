import { theme, themeUtils } from '@island.is/island-ui/theme'
import {
  globalStyle,
  style,
  styleVariants,
  ComplexStyleRule,
} from '@vanilla-extract/css'
import * as mixins from '../Input/Input.mixins'

export const root = style({
  position: 'relative',
  minWidth: '250px',
})

export const detached = style({})

export const backgroundBlue = style({
  selectors: {
    [`${root} &`]: {
      backgroundColor: `${theme.color.blue100} !important`,
    },
  },
})

export const parentContainer = style({
  position: 'relative',
})
export const calendarContainer = style({
  position: 'relative',
  zIndex: 1,
})

export const displaySelectInput = style({})

const weekendBase: ComplexStyleRule = {
  zIndex: 0,
  content: '""',
  display: 'block',
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: 'var(--weekend-width)',
  backgroundColor: 'rgba(204, 223, 255, 0.3)',
  pointerEvents: 'none',
}

export const weekendHeight = styleVariants({
  fourWeeks: {},
  fiveWeeks: {},
  sixWeeks: {},
})

globalStyle(`${calendarContainer}::before`, {
  ...weekendBase,
})

globalStyle(`${calendarContainer}.${weekendHeight.fourWeeks}::before`, {
  ...weekendBase,
  ...themeUtils.responsiveStyle({
    xs: {
      height: 195,
      top: 57,
    },
    md: {
      height: 196,
    },
  }),
})

globalStyle(
  `${calendarContainer}.${weekendHeight.fourWeeks}.${displaySelectInput}::before`,
  {
    ...weekendBase,
    ...themeUtils.responsiveStyle({
      xs: {
        height: 195,
        top: 78,
      },
      md: {
        height: 196,
        top: 87,
      },
    }),
  },
)

globalStyle(`${calendarContainer}.${weekendHeight.fiveWeeks}::before`, {
  ...weekendBase,
  ...themeUtils.responsiveStyle({
    xs: {
      height: 230,
      top: 57,
    },
    md: {
      height: 231,
    },
  }),
})

globalStyle(
  `${calendarContainer}.${weekendHeight.fiveWeeks}.${displaySelectInput}::before`,
  {
    ...weekendBase,
    ...themeUtils.responsiveStyle({
      xs: {
        height: 230,
        top: 78,
      },
      md: {
        height: 231,
        top: 87,
      },
    }),
  },
)

globalStyle(`${calendarContainer}.${weekendHeight.sixWeeks}::before`, {
  ...weekendBase,
  ...themeUtils.responsiveStyle({
    xs: {
      height: 265,
      top: 57,
    },
    md: {
      height: 266,
    },
  }),
})

globalStyle(
  `${calendarContainer}.${weekendHeight.sixWeeks}.${displaySelectInput}::before`,
  {
    ...weekendBase,
    ...themeUtils.responsiveStyle({
      xs: {
        height: 265,
        top: 78,
      },
      md: {
        height: 266,
        top: 87,
      },
    }),
  },
)

export const small = style({})
export const extraSmall = style({})
export const medium = style({})

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
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[2],
  marginBottom: theme.spacing[2],
  position: 'relative',
  zIndex: 1,
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
  top: '-12px !important',
})

export const rangeContainer = style({
  position: 'relative',
  '::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    marginTop: theme.spacing[1],
    top: 0,
    height: '1px',
    left: 0,
    right: 0,
    background: theme.color.blue200,
  },
})

export const rangeItem = style({
  flex: 1,
  textAlign: 'center',
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
  padding: `${theme.spacing.gutter}px ${theme.spacing.gutter}px`,
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
    fontSize: 14,
    lineHeight: `${theme.typography.baseLineHeight}`,
    textAlign: 'center',
    color: `${theme.color.dark400}`,
    textTransform: 'capitalize',
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

globalStyle(`${root}.island-ui-datepicker .react-datepicker__day--today`, {
  background: `${theme.color.transparent} !important`,
  color: `${theme.color.dark400} !important`,
  border: `1px solid ${theme.color.blue200} !important`,
  borderRadius: theme.border.radius.large,
  outline: 'none !important',
  transition: 'border-color 0.3s, color 0.3s',
})

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker__day--selected, .react-datepicker__day--selected:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover`,
  {
    background: `${theme.color.blue400} !important`,
    color: `${theme.color.white} !important`,
  },
)
globalStyle(`${root}.island-ui-datepicker .react-datepicker__day--range-end`, {
  background: `${theme.color.blue400} !important`,
  color: `${theme.color.white} !important`,
})

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker-popper[data-placement^="top"]`,
  {
    zIndex: 99, // Needed to be above mobile header
    top: '33px !important',
  },
)

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker-popper[data-placement^="bottom"]`,
  {
    top: '-17px !important',
  },
)

globalStyle(
  `${root}.island-ui-datepicker ${popperInline}.react-datepicker-popper[data-placement^="bottom"]`,
  {
    top: '-12px !important',
  },
)

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker-popper[data-placement^="top"] .react-datepicker`,
  {
    top: '-12px',
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
    borderBottomRightRadius: '0',
    borderBottomLeftRadius: '0',
    boxShadow: `inset -3px 0px 0px ${theme.color.mint400}, inset 3px 0px 0px ${theme.color.mint400}, inset -1px 3px 0px ${theme.color.mint400}`,
  },
)

globalStyle(
  `${root}.island-ui-datepicker.${extraSmall} .react-datepicker-popper[data-placement^="top"] .react-datepicker`,
  {
    top: '7px',
  },
)

globalStyle(
  `${root}.island-ui-datepicker .react-datepicker-popper[data-placement^="top"] .react-datepicker__header--custom .date-picker-custom-header`,
  {
    borderTop: 0,
  },
)

/* Time picker styles */

globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input`,
  {
    fontFamily: 'IBM Plex Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: `${theme.typography.baseFontSize}px`,
    lineHeight: `${theme.typography.baseLineHeight}`,
    textAlign: 'center',
    color: `${theme.color.dark400}`,
    padding: '10px 10px 10px 20px',
    border: '1px solid #ccdfff',
    borderRadius: '0.3rem',
    marginLeft: '5px',
  },
)

globalStyle(`${root} .react-datepicker__input-time-container`, {
  marginTop: '15px',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  float: 'none !important' as any,
  margin: '30px 0px 0px 5px !important',
})

globalStyle(`${root} .react-datepicker__day--in-range`, {
  backgroundColor: `${theme.color.blue200} !important`,
})

globalStyle(`${root} .react-datepicker__day--range-end`, {
  backgroundColor: `${theme.color.blue400} !important`,
  color: `${theme.color.white} !important`,
})

globalStyle(`${root} .react-datepicker__day--in-selecting-range`, {
  backgroundColor: `${theme.color.blue200} !important`,
})

// Detached calendar mode: calendar and input are visually separate
globalStyle(`${root}.${detached}.${small}`, {
  minWidth: 180,
})

globalStyle(`${root}.${detached}.${extraSmall}`, {
  minWidth: 160,
})

globalStyle(`${root}.${detached}.${medium}`, {
  minWidth: 230,
})

globalStyle(`${root}.${detached} input`, {
  paddingRight: 0,
  paddingLeft: 8,
})

globalStyle(`${root}.island-ui-datepicker.${detached} .react-datepicker`, {
  borderRadius: '8px',
  boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  minWidth: '250px',
})

globalStyle(
  `${root}.island-ui-datepicker.${detached} .react-datepicker-popper`,
  {
    width: 'auto',
  },
)

globalStyle(
  `${root}.island-ui-datepicker.${detached} .react-datepicker-popper[data-placement^="bottom"]`,
  {
    top: '0px !important',
    paddingTop: `${theme.spacing[1]}px`,
  },
)

globalStyle(
  `${root}.island-ui-datepicker.${detached} .react-datepicker-popper[data-placement^="top"]`,
  {
    top: '0px !important',
    paddingBottom: `${theme.spacing[1]}px`,
  },
)

globalStyle(
  `${root}.island-ui-datepicker.${detached} .react-datepicker-popper[data-placement^="top"] .react-datepicker`,
  {
    top: '0',
    borderRadius: '8px',
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
)

globalStyle(
  `${root}.island-ui-datepicker.${detached}:has(.react-datepicker-wrapper:focus-within) .react-datepicker`,
  {
    boxShadow: `inset 0 0 0 1px ${theme.color.blue200}`,
  },
)
