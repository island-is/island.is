import { style, globalStyle } from '@vanilla-extract/css'

export const root = style({})

globalStyle(
  `${root} .react-datepicker__year-read-view--down-arrow, ${root} .react-datepicker__month-read-view--down-arrow, ${root} .react-datepicker__month-year-read-view--down-arrow, ${root} .react-datepicker__navigation-icon::before`,
  {
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderWidth: '3px 3px 0 0',
    content: '""',
    display: 'block',
    height: '9px',
    position: 'absolute',
    top: '6px',
    width: '9px',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle, ${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle`,
  {
    marginLeft: '-8px',
    position: 'absolute',
    width: '0',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::before, ${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before, ${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::after, ${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::after`,
  {
    boxSizing: 'content-box',
    position: 'absolute',
    border: '8px solid transparent',
    height: '0',
    width: '1px',
    content: '""',
    zIndex: '-1',
    borderWidth: '8px',
    left: '-8px',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::before, ${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before`,
  {
    borderBottomColor: '#aeaeae',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle`,
  {
    top: '0',
    marginTop: '-8px',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before, ${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::after`,
  {
    borderTop: 'none',
    borderBottomColor: '#f0f0f0',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::after`,
  {
    top: '0',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before`,
  {
    top: '-1px',
    borderBottomColor: '#aeaeae',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle`,
  {
    bottom: '0',
    marginBottom: '-8px',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::before, ${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::after`,
  {
    borderBottom: 'none',
    borderTopColor: '#fff',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::after`,
  {
    bottom: '0',
  },
)
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::before`,
  {
    bottom: '-1px',
    borderTopColor: '#aeaeae',
  },
)

globalStyle(`${root} .react-datepicker-wrapper`, {
  display: 'inline-block',
  padding: '0',
  border: '0',
  width: '100%',
})

globalStyle(`${root} .react-datepicker`, {
  fontFamily: '"Helvetica Neue", helvetica, arial, sans-serif',
  fontSize: '0.8rem',
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #aeaeae',
  borderRadius: '0.3rem',
  display: 'inline-block',
  position: 'relative',
})

globalStyle(
  `${root} .react-datepicker--time-only .react-datepicker__triangle`,
  {
    left: '35px',
  },
)
globalStyle(
  `${root} .react-datepicker--time-only .react-datepicker__time-container`,
  {
    borderLeft: '0',
  },
)
globalStyle(
  `${root} .react-datepicker--time-only .react-datepicker__time, ${root} .react-datepicker--time-only .react-datepicker__time-box`,
  {
    borderBottomLeftRadius: '0.3rem',
    borderBottomRightRadius: '0.3rem',
  },
)

globalStyle(`${root} .react-datepicker__triangle`, {
  position: 'absolute',
  left: '50px',
})

globalStyle(`${root} .react-datepicker-popper`, {
  zIndex: '3',
})
globalStyle(`${root} .react-datepicker-popper[data-placement^=bottom]`, {
  paddingTop: '10px',
})
globalStyle(
  `${root} .react-datepicker-popper[data-placement=bottom-end] .react-datepicker__triangle, ${root} .react-datepicker-popper[data-placement=top-end] .react-datepicker__triangle`,
  {
    left: 'auto',
    right: '50px',
  },
)
globalStyle(`${root} .react-datepicker-popper[data-placement^=top]`, {
  paddingBottom: '10px',
})
globalStyle(`${root} .react-datepicker-popper[data-placement^=right]`, {
  paddingLeft: '8px',
})
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=right] .react-datepicker__triangle`,
  {
    left: 'auto',
    right: '42px',
  },
)
globalStyle(`${root} .react-datepicker-popper[data-placement^=left]`, {
  paddingRight: '8px',
})
globalStyle(
  `${root} .react-datepicker-popper[data-placement^=left] .react-datepicker__triangle`,
  {
    left: '42px',
    right: 'auto',
  },
)

globalStyle(`${root} .react-datepicker__header`, {
  textAlign: 'center',
  backgroundColor: '#f0f0f0',
  borderBottom: '1px solid #aeaeae',
  borderTopLeftRadius: '0.3rem',
  padding: '8px 0',
  position: 'relative',
})
globalStyle(`${root} .react-datepicker__header--time`, {
  paddingBottom: '8px',
  paddingLeft: '5px',
  paddingRight: '5px',
})
globalStyle(
  `${root} .react-datepicker__header--time:not(.react-datepicker__header--time--only)`,
  {
    borderTopLeftRadius: '0',
  },
)
globalStyle(
  `${root} .react-datepicker__header:not(.react-datepicker__header--has-time-select)`,
  {
    borderTopRightRadius: '0.3rem',
  },
)

globalStyle(
  `${root} .react-datepicker__year-dropdown-container--select, ${root} .react-datepicker__month-dropdown-container--select, ${root} .react-datepicker__month-year-dropdown-container--select, ${root} .react-datepicker__year-dropdown-container--scroll, ${root} .react-datepicker__month-dropdown-container--scroll, ${root} .react-datepicker__month-year-dropdown-container--scroll`,
  {
    display: 'inline-block',
    margin: '0 15px',
  },
)

globalStyle(
  `${root} .react-datepicker__current-month, ${root} .react-datepicker-time__header, ${root} .react-datepicker-year-header`,
  {
    marginTop: '0',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '0.944rem',
  },
)

globalStyle(`${root} .react-datepicker-time__header`, {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

globalStyle(`${root} .react-datepicker__navigation`, {
  alignItems: 'center',
  background: 'none',
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  position: 'absolute',
  top: '2px',
  padding: '0',
  border: 'none',
  zIndex: '1',
  height: '32px',
  width: '32px',
  textIndent: '-999em',
  overflow: 'hidden',
})
globalStyle(`${root} .react-datepicker__navigation--previous`, {
  left: '2px',
})
globalStyle(`${root} .react-datepicker__navigation--next`, {
  right: '2px',
})
globalStyle(
  `${root} .react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button)`,
  {
    right: '85px',
  },
)
globalStyle(`${root} .react-datepicker__navigation--years`, {
  position: 'relative',
  top: '0',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
})
globalStyle(`${root} .react-datepicker__navigation--years-previous`, {
  top: '4px',
})
globalStyle(`${root} .react-datepicker__navigation--years-upcoming`, {
  top: '-4px',
})
globalStyle(`${root} .react-datepicker__navigation:hover *::before`, {
  borderColor: '#a6a6a6',
})

globalStyle(`${root} .react-datepicker__navigation-icon`, {
  position: 'relative',
  top: '-1px',
  fontSize: '20px',
  width: '0',
})
globalStyle(`${root} .react-datepicker__navigation-icon--next`, {
  left: '-2px',
})
globalStyle(`${root} .react-datepicker__navigation-icon--next::before`, {
  transform: 'rotate(45deg)',
  left: '-7px',
})
globalStyle(`${root} .react-datepicker__navigation-icon--previous`, {
  right: '-2px',
})
globalStyle(`${root} .react-datepicker__navigation-icon--previous::before`, {
  transform: 'rotate(225deg)',
  right: '-7px',
})

globalStyle(`${root} .react-datepicker__month-container`, {
  float: 'left',
})

globalStyle(`${root} .react-datepicker__year`, {
  margin: '0.4rem',
  textAlign: 'center',
})
globalStyle(`${root} .react-datepicker__year-wrapper`, {
  display: 'flex',
  flexWrap: 'wrap',
  maxWidth: '180px',
})
globalStyle(`${root} .react-datepicker__year .react-datepicker__year-text`, {
  display: 'inline-block',
  width: '4rem',
  margin: '2px',
})

globalStyle(`${root} .react-datepicker__month`, {
  margin: '0.4rem',
  textAlign: 'center',
})
globalStyle(
  `${root} .react-datepicker__month .react-datepicker__month-text, ${root} .react-datepicker__month .react-datepicker__quarter-text`,
  {
    display: 'inline-block',
    width: '4rem',
    margin: '2px',
  },
)

globalStyle(`${root} .react-datepicker__input-time-container`, {
  clear: 'both',
  width: '100%',
  float: 'left',
  margin: '5px 0 10px 15px',
  textAlign: 'left',
})
globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__caption`,
  {
    display: 'inline-block',
  },
)
globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container`,
  {
    display: 'inline-block',
  },
)
globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input`,
  {
    display: 'inline-block',
    marginLeft: '10px',
  },
)
globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input`,
  {
    width: 'auto',
  },
)
globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type=time]::-webkit-inner-spin-button, ${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type=time]::-webkit-outer-spin-button`,
  {
    appearance: 'none',
    margin: '0',
  },
)
globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type=time]`,
  {
    appearance: 'textfield',
  },
)
globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__delimiter`,
  {
    marginLeft: '5px',
    display: 'inline-block',
  },
)

globalStyle(`${root} .react-datepicker__time-container`, {
  float: 'right',
  borderLeft: '1px solid #aeaeae',
  width: '85px',
})
globalStyle(`${root} .react-datepicker__time-container--with-today-button`, {
  display: 'inline',
  border: '1px solid #aeaeae',
  borderRadius: '0.3rem',
  position: 'absolute',
  right: '-87px',
  top: '0',
})
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time`,
  {
    position: 'relative',
    background: 'white',
    borderBottomRightRadius: '0.3rem',
  },
)
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box`,
  {
    width: '85px',
    overflowX: 'hidden',
    margin: '0 auto',
    textAlign: 'center',
    borderBottomRightRadius: '0.3rem',
  },
)
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list`,
  {
    listStyle: 'none',
    margin: '0',
    height: 'calc(195px + (1.7rem / 2))',
    overflowY: 'scroll',
    paddingRight: '0',
    paddingLeft: '0',
    width: '100%',
    boxSizing: 'content-box',
  },
)
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item`,
  {
    height: '30px',
    padding: '5px 10px',
    whiteSpace: 'nowrap',
  },
)
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover`,
  {
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
  },
)
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected`,
  {
    backgroundColor: '#216ba5',
    color: 'white',
    fontWeight: 'bold',
  },
)
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected:hover`,
  {
    backgroundColor: '#216ba5',
  },
)
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled`,
  {
    color: '#ccc',
  },
)
globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled:hover`,
  {
    cursor: 'default',
    backgroundColor: 'transparent',
  },
)

globalStyle(`${root} .react-datepicker__week-number`, {
  color: '#ccc',
  display: 'inline-block',
  width: '1.7rem',
  lineHeight: '1.7rem',
  textAlign: 'center',
  margin: '0.166rem',
})
globalStyle(
  `${root} .react-datepicker__week-number.react-datepicker__week-number--clickable`,
  {
    cursor: 'pointer',
  },
)
globalStyle(
  `${root} .react-datepicker__week-number.react-datepicker__week-number--clickable:hover`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#f0f0f0',
  },
)

globalStyle(
  `${root} .react-datepicker__day-names, ${root} .react-datepicker__week`,
  {
    whiteSpace: 'nowrap',
  },
)

globalStyle(`${root} .react-datepicker__day-names`, {
  marginBottom: '-8px',
})

globalStyle(
  `${root} .react-datepicker__day-name, ${root} .react-datepicker__day, ${root} .react-datepicker__time-name`,
  {
    color: '#000',
    display: 'inline-block',
    width: '1.7rem',
    lineHeight: '1.7rem',
    textAlign: 'center',
    margin: '0.166rem',
  },
)

globalStyle(
  `${root} .react-datepicker__month--selected, ${root} .react-datepicker__month--in-selecting-range, ${root} .react-datepicker__month--in-range, ${root} .react-datepicker__quarter--selected, ${root} .react-datepicker__quarter--in-selecting-range, ${root} .react-datepicker__quarter--in-range`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#216ba5',
    color: '#fff',
  },
)
globalStyle(
  `${root} .react-datepicker__month--selected:hover, ${root} .react-datepicker__month--in-selecting-range:hover, ${root} .react-datepicker__month--in-range:hover, ${root} .react-datepicker__quarter--selected:hover, ${root} .react-datepicker__quarter--in-selecting-range:hover, ${root} .react-datepicker__quarter--in-range:hover`,
  {
    backgroundColor: '#1d5d90',
  },
)
globalStyle(
  `${root} .react-datepicker__month--disabled, ${root} .react-datepicker__quarter--disabled`,
  {
    color: '#ccc',
    pointerEvents: 'none',
  },
)
globalStyle(
  `${root} .react-datepicker__month--disabled:hover, ${root} .react-datepicker__quarter--disabled:hover`,
  {
    cursor: 'default',
    backgroundColor: 'transparent',
  },
)

globalStyle(
  `${root} .react-datepicker__day, ${root} .react-datepicker__month-text, ${root} .react-datepicker__quarter-text, ${root} .react-datepicker__year-text`,
  {
    cursor: 'pointer',
  },
)
globalStyle(
  `${root} .react-datepicker__day:hover, ${root} .react-datepicker__month-text:hover, ${root} .react-datepicker__quarter-text:hover, ${root} .react-datepicker__year-text:hover`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#f0f0f0',
  },
)
globalStyle(
  `${root} .react-datepicker__day--today, ${root} .react-datepicker__month-text--today, ${root} .react-datepicker__quarter-text--today, ${root} .react-datepicker__year-text--today`,
  {
    fontWeight: 'bold',
  },
)
globalStyle(
  `${root} .react-datepicker__day--highlighted, ${root} .react-datepicker__month-text--highlighted, ${root} .react-datepicker__quarter-text--highlighted, ${root} .react-datepicker__year-text--highlighted`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#3dcc4a',
    color: '#fff',
  },
)
globalStyle(
  `${root} .react-datepicker__day--highlighted:hover, ${root} .react-datepicker__month-text--highlighted:hover, ${root} .react-datepicker__quarter-text--highlighted:hover, ${root} .react-datepicker__year-text--highlighted:hover`,
  {
    backgroundColor: '#32be3f',
  },
)
globalStyle(
  `${root} .react-datepicker__day--highlighted-custom-1, ${root} .react-datepicker__month-text--highlighted-custom-1, ${root} .react-datepicker__quarter-text--highlighted-custom-1, ${root} .react-datepicker__year-text--highlighted-custom-1`,
  {
    color: 'magenta',
  },
)
globalStyle(
  `${root} .react-datepicker__day--highlighted-custom-2, ${root} .react-datepicker__month-text--highlighted-custom-2, ${root} .react-datepicker__quarter-text--highlighted-custom-2, ${root} .react-datepicker__year-text--highlighted-custom-2`,
  {
    color: 'green',
  },
)
globalStyle(
  `${root} .react-datepicker__day--selected, ${root} .react-datepicker__day--in-selecting-range, ${root} .react-datepicker__day--in-range, ${root} .react-datepicker__month-text--selected, ${root} .react-datepicker__month-text--in-selecting-range, ${root} .react-datepicker__month-text--in-range, ${root} .react-datepicker__quarter-text--selected, ${root} .react-datepicker__quarter-text--in-selecting-range, ${root} .react-datepicker__quarter-text--in-range, ${root} .react-datepicker__year-text--selected, ${root} .react-datepicker__year-text--in-selecting-range, ${root} .react-datepicker__year-text--in-range`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#216ba5',
    color: '#fff',
  },
)
globalStyle(
  `${root} .react-datepicker__day--selected:hover, ${root} .react-datepicker__day--in-selecting-range:hover, ${root} .react-datepicker__day--in-range:hover, ${root} .react-datepicker__month-text--selected:hover, ${root} .react-datepicker__month-text--in-selecting-range:hover, ${root} .react-datepicker__month-text--in-range:hover, ${root} .react-datepicker__quarter-text--selected:hover, ${root} .react-datepicker__quarter-text--in-selecting-range:hover, ${root} .react-datepicker__quarter-text--in-range:hover, ${root} .react-datepicker__year-text--selected:hover, ${root} .react-datepicker__year-text--in-selecting-range:hover, ${root} .react-datepicker__year-text--in-range:hover`,
  {
    backgroundColor: '#1d5d90',
  },
)
globalStyle(
  `${root} .react-datepicker__day--keyboard-selected, ${root} .react-datepicker__month-text--keyboard-selected, ${root} .react-datepicker__quarter-text--keyboard-selected, ${root} .react-datepicker__year-text--keyboard-selected`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#bad9f1',
    color: 'rgb(0, 0, 0)',
  },
)
globalStyle(
  `${root} .react-datepicker__day--keyboard-selected:hover, ${root} .react-datepicker__month-text--keyboard-selected:hover, ${root} .react-datepicker__quarter-text--keyboard-selected:hover, ${root} .react-datepicker__year-text--keyboard-selected:hover`,
  {
    backgroundColor: '#1d5d90',
  },
)
globalStyle(
  `${root} .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), ${root} .react-datepicker__month-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), ${root} .react-datepicker__quarter-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), ${root} .react-datepicker__year-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range)`,
  {
    backgroundColor: 'rgba(33, 107, 165, 0.5)',
  },
)
globalStyle(
  `${root} .react-datepicker__month--selecting-range .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range, .react-datepicker__month-text--in-selecting-range, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__year-text--in-selecting-range), ${root} .react-datepicker__month--selecting-range .react-datepicker__month-text--in-range:not(.react-datepicker__day--in-selecting-range, .react-datepicker__month-text--in-selecting-range, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__year-text--in-selecting-range), ${root} .react-datepicker__month--selecting-range .react-datepicker__quarter-text--in-range:not(.react-datepicker__day--in-selecting-range, .react-datepicker__month-text--in-selecting-range, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__year-text--in-selecting-range), ${root} .react-datepicker__month--selecting-range .react-datepicker__year-text--in-range:not(.react-datepicker__day--in-selecting-range, .react-datepicker__month-text--in-selecting-range, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__year-text--in-selecting-range)`,
  {
    backgroundColor: '#f0f0f0',
    color: '#000',
  },
)
globalStyle(
  `${root} .react-datepicker__day--disabled, ${root} .react-datepicker__month-text--disabled, ${root} .react-datepicker__quarter-text--disabled, ${root} .react-datepicker__year-text--disabled`,
  {
    cursor: 'default',
    color: '#ccc',
  },
)
globalStyle(
  `${root} .react-datepicker__day--disabled:hover, ${root} .react-datepicker__month-text--disabled:hover, ${root} .react-datepicker__quarter-text--disabled:hover, ${root} .react-datepicker__year-text--disabled:hover`,
  {
    backgroundColor: 'transparent',
  },
)

globalStyle(
  `${root} .react-datepicker__month-text.react-datepicker__month--selected:hover, ${root} .react-datepicker__month-text.react-datepicker__month--in-range:hover, ${root} .react-datepicker__month-text.react-datepicker__quarter--selected:hover, ${root} .react-datepicker__month-text.react-datepicker__quarter--in-range:hover, ${root} .react-datepicker__quarter-text.react-datepicker__month--selected:hover, ${root} .react-datepicker__quarter-text.react-datepicker__month--in-range:hover, ${root} .react-datepicker__quarter-text.react-datepicker__quarter--selected:hover, ${root} .react-datepicker__quarter-text.react-datepicker__quarter--in-range:hover`,
  {
    backgroundColor: '#216ba5',
  },
)
globalStyle(
  `${root} .react-datepicker__month-text:hover, ${root} .react-datepicker__quarter-text:hover`,
  {
    backgroundColor: '#f0f0f0',
  },
)

globalStyle(`${root} .react-datepicker__input-container`, {
  position: 'relative',
  display: 'inline-block',
  width: '100%',
})

globalStyle(
  `${root} .react-datepicker__year-read-view, ${root} .react-datepicker__month-read-view, ${root} .react-datepicker__month-year-read-view`,
  {
    border: '1px solid transparent',
    borderRadius: '0.3rem',
    position: 'relative',
  },
)
globalStyle(
  `${root} .react-datepicker__year-read-view:hover, ${root} .react-datepicker__month-read-view:hover, ${root} .react-datepicker__month-year-read-view:hover`,
  {
    cursor: 'pointer',
  },
)
globalStyle(
  `${root} .react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow, ${root} .react-datepicker__year-read-view:hover .react-datepicker__month-read-view--down-arrow, ${root} .react-datepicker__month-read-view:hover .react-datepicker__year-read-view--down-arrow, ${root} .react-datepicker__month-read-view:hover .react-datepicker__month-read-view--down-arrow, ${root} .react-datepicker__month-year-read-view:hover .react-datepicker__year-read-view--down-arrow, ${root} .react-datepicker__month-year-read-view:hover .react-datepicker__month-read-view--down-arrow`,
  {
    borderTopColor: '#b3b3b3',
  },
)
globalStyle(
  `${root} .react-datepicker__year-read-view--down-arrow, ${root} .react-datepicker__month-read-view--down-arrow, ${root} .react-datepicker__month-year-read-view--down-arrow`,
  {
    transform: 'rotate(135deg)',
    right: '-16px',
    top: '0',
  },
)

globalStyle(
  `${root} .react-datepicker__year-dropdown, ${root} .react-datepicker__month-dropdown, ${root} .react-datepicker__month-year-dropdown`,
  {
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    width: '50%',
    left: '25%',
    top: '30px',
    zIndex: '1',
    textAlign: 'center',
    borderRadius: '0.3rem',
    border: '1px solid #aeaeae',
  },
)
globalStyle(
  `${root} .react-datepicker__year-dropdown:hover, ${root} .react-datepicker__month-dropdown:hover, ${root} .react-datepicker__month-year-dropdown:hover`,
  {
    cursor: 'pointer',
  },
)
globalStyle(
  `${root} .react-datepicker__year-dropdown--scrollable, ${root} .react-datepicker__month-dropdown--scrollable, ${root} .react-datepicker__month-year-dropdown--scrollable`,
  {
    height: '150px',
    overflowY: 'scroll',
  },
)

globalStyle(
  `${root} .react-datepicker__year-option, ${root} .react-datepicker__month-option, ${root} .react-datepicker__month-year-option`,
  {
    lineHeight: '20px',
    width: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
)
globalStyle(
  `${root} .react-datepicker__year-option:first-of-type, ${root} .react-datepicker__month-option:first-of-type, ${root} .react-datepicker__month-year-option:first-of-type`,
  {
    borderTopLeftRadius: '0.3rem',
    borderTopRightRadius: '0.3rem',
  },
)
globalStyle(
  `${root} .react-datepicker__year-option:last-of-type, ${root} .react-datepicker__month-option:last-of-type, ${root} .react-datepicker__month-year-option:last-of-type`,
  {
    userSelect: 'none',
    borderBottomLeftRadius: '0.3rem',
    borderBottomRightRadius: '0.3rem',
  },
)
globalStyle(
  `${root} .react-datepicker__year-option:hover, ${root} .react-datepicker__month-option:hover, ${root} .react-datepicker__month-year-option:hover`,
  {
    backgroundColor: '#ccc',
  },
)
globalStyle(
  `${root} .react-datepicker__year-option:hover .react-datepicker__navigation--years-upcoming, ${root} .react-datepicker__month-option:hover .react-datepicker__navigation--years-upcoming, ${root} .react-datepicker__month-year-option:hover .react-datepicker__navigation--years-upcoming`,
  {
    borderBottomColor: '#b3b3b3',
  },
)
globalStyle(
  `${root} .react-datepicker__year-option:hover .react-datepicker__navigation--years-previous, ${root} .react-datepicker__month-option:hover .react-datepicker__navigation--years-previous, ${root} .react-datepicker__month-year-option:hover .react-datepicker__navigation--years-previous`,
  {
    borderTopColor: '#b3b3b3',
  },
)
globalStyle(
  `${root} .react-datepicker__year-option--selected, ${root} .react-datepicker__month-option--selected, ${root} .react-datepicker__month-year-option--selected`,
  {
    position: 'absolute',
    left: '15px',
  },
)

globalStyle(`${root} .react-datepicker__close-icon`, {
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '0',
  outline: '0',
  padding: '0 6px 0 0',
  position: 'absolute',
  top: '0',
  right: '0',
  height: '100%',
  display: 'table-cell',
  verticalAlign: 'middle',
})
globalStyle(`${root} .react-datepicker__close-icon::after`, {
  cursor: 'pointer',
  backgroundColor: '#216ba5',
  color: '#fff',
  borderRadius: '50%',
  height: '16px',
  width: '16px',
  padding: '2px',
  fontSize: '12px',
  lineHeight: '1',
  textAlign: 'center',
  display: 'table-cell',
  verticalAlign: 'middle',
  content: '"×"',
})

globalStyle(`${root} .react-datepicker__today-button`, {
  background: '#f0f0f0',
  borderTop: '1px solid #aeaeae',
  cursor: 'pointer',
  textAlign: 'center',
  fontWeight: 'bold',
  padding: '5px 0',
  clear: 'left',
})

globalStyle(`${root} .react-datepicker__portal`, {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  left: '0',
  top: '0',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  zIndex: '2147483647',
})
globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__day-name, ${root} .react-datepicker__portal .react-datepicker__day, ${root} .react-datepicker__portal .react-datepicker__time-name`,
  {
    width: '3rem',
    lineHeight: '3rem',
    '@media': {
      '(max-width: 400px), (max-height: 550px)': {
        width: '2rem',
        lineHeight: '2rem',
      },
    },
  },
)

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__current-month, ${root} .react-datepicker__portal .react-datepicker-time__header`,
  {
    fontSize: '1.44rem',
  },
)

globalStyle(`${root} .react-datepicker__children-container`, {
  width: '13.8rem',
  margin: '0.4rem',
  paddingRight: '0.2rem',
  paddingLeft: '0.2rem',
  height: 'auto',
})

globalStyle(`${root} .react-datepicker__aria-live`, {
  position: 'absolute',
  clipPath: 'circle(0)',
  border: '0',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  width: '1px',
  whiteSpace: 'nowrap',
})
