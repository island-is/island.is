import { style, styleMap, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  position: 'relative',
})

export const inputContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTopRightRadius: 8,
  borderTopLeftRadius: 8,
  padding: `${theme.spacing[1]}px ${theme.spacing[3]}px ${theme.spacing[1]}px ${theme.spacing[1]}px`,
  width: '100%',
  outline: 'none',
  border: `1px solid transparent`,

  ':active': {
    boxShadow: '0 0 0 4px transparent',
  },
  ':focus': {
    boxShadow: `0 0 0 4px ${theme.color.mint400}`,
  },
})

export const inputContainerVariants = styleMap({
  open: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    boxShadow: `0 0 0 4px ${theme.color.mint400}`,
    border: `1px solid transparent`,
  },
  closed: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    border: `1px solid ${theme.color.blue200}`,
  },
})

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

export const value = style({
  padding: `0 ${theme.spacing[2]}px`,
})

export const customHeaderContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.color.blue200}`,
  paddingBottom: theme.spacing[2],
  marginBottom: theme.spacing[2],
})

export const decreaseButton = style({
  transform: 'rotate(90deg)',
  outline: 'none',

  ':focus': {
    boxShadow: `0 0 0 4px ${theme.color.mint400}`,
  },
})

export const increaseButton = style({
  transform: 'rotate(-90deg)',
  outline: 'none',

  ':focus': {
    boxShadow: `0 0 0 4px ${theme.color.mint400}`,
  },
})

// Overwrite default ReactDatepicker styles
globalStyle(`${root} .react-datepicker`, {
  display: 'block',
  borderTopRightRadius: '0',
  borderTopLeftRadius: '0',
  borderBottomRightRadius: '8px',
  borderBottomLeftRadius: '8px',
  boxShadow: `-4px 4px 0px ${theme.color.mint400}, 4px 4px 0px ${theme.color.mint400}`,
  border: 'none',
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
})

globalStyle(`${root} .react-datepicker-wrapper`, { display: 'block' })

globalStyle(`${root} .react-datepicker__header`, {
  backgroundColor: `${theme.color.white}`,
  borderBottom: 'none',
})

globalStyle(`${root} .react-datepicker-popper[data-placement^='bottom']`, {
  marginTop: '0',
  right: '0',
  top: '68px !important',
  transform: 'none !important',
})

globalStyle(`${root} .react-datepicker__month-container`, { float: 'none' })
globalStyle(`${root} .react-datepicker__month`, {
  margin: `0 0 ${theme.spacing[2]}px 0`,
})
globalStyle(`${root} .react-datepicker__day-names`, { marginBottom: '4px' })
globalStyle(`${root} .react-datepicker__day-name, .react-datepicker__day`, {
  fontFamily: 'IBM Plex Sans',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: `${theme.typography.baseFontSize}px`,
  lineHeight: `${theme.typography.baseLineHeight}px`,
  textAlign: 'center',
  color: `${theme.color.dark400}`,
  margin: `0 ${theme.spacing[4]}px 0 0`,
})

globalStyle(
  `${root} .react-datepicker__day-name:last-child, .react-datepicker__day:last-child`,
  {
    margin: '0',
  },
)

globalStyle(`${root} .react-datepicker__day--disabled`, {
  color: `${theme.color.dark400} !important`,
})

globalStyle(`${root} .react-datepicker__day--disabled:hover`, {
  borderColor: 'transparent !important',
})

globalStyle(`${root} .react-datepicker__day`, {
  fontFamily: 'IBM Plex Sans',
  fontStyle: 'normal',
  fontWeight: 300,
  fontSize: `${theme.typography.baseFontSize}`,
  lineHeight: `${theme.typography.baseLineHeight}`,
  textAlign: 'center',
  color: `${theme.color.dark400}`,
  border: '1px solid transparent',
  borderRadius: '5px',
  outline: 'none !important',
  transition: 'border-color 0.3s, color 0.3s',
})

globalStyle(`${root} .react-datepicker__day:hover`, {
  background: `${theme.color.blue100}`,
  borderColor: `${theme.color.blue400}`,
})

globalStyle(
  `${root} .react-datepicker__day--selected, .react-datepicker__day--selected:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover, .react-datepicker__day--keyboard-selected`,
  {
    background: `${theme.color.blue400} !important`,
    color: `${theme.color.white} !important`,
  },
)
