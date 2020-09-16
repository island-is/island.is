import { style, globalStyle } from 'treat'

export const root = style({})

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle, .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle, .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow`,
  {
    marginLeft: '-8px',
    position: 'absolute',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle, .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle, .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow, .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before, .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before, .react-datepicker__year-read-view--down-arrow::before, .react-datepicker__month-read-view--down-arrow::before, .react-datepicker__month-year-read-view--down-arrow::before`,
  {
    boxSizing: 'content-box',
    position: 'absolute',
    border: '8px solid transparent',
    height: '0',
    width: '1px',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before, .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before, .react-datepicker__year-read-view--down-arrow::before, .react-datepicker__month-read-view--down-arrow::before, .react-datepicker__month-year-read-view--down-arrow::before`,
  {
    content: '""',
    zIndex: -1,
    borderWidth: '8px',
    left: '-8px',
    borderBottomColor: '#aeaeae',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle`,
  {
    top: '0',
    marginTop: '-8px',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle, .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before`,
  {
    borderTop: 'none',
    borderBottomColor: '#f0f0f0',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before`,
  {
    top: '-1px',
    borderBottomColor: '#aeaeae',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle, .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow`,
  {
    bottom: '0',
    marginBottom: '-8px',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle, .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow, .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before, .react-datepicker__year-read-view--down-arrow::before, .react-datepicker__month-read-view--down-arrow::before, .react-datepicker__month-year-read-view--down-arrow::before`,
  {
    borderBottom: 'none',
    borderTopColor: '#fff',
  },
)

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before, .react-datepicker__year-read-view--down-arrow::before, .react-datepicker__month-read-view--down-arrow::before, .react-datepicker__month-year-read-view--down-arrow::before`,
  {
    bottom: '-1px',
    borderTopColor: '#aeaeae',
  },
)

globalStyle(`${root} .react-datepicker-wrapper`, {
  display: 'inline-block',
  padding: '0',
  border: '0',
})

globalStyle(`${root} .react-datepicker`, {
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
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

globalStyle(`${root} .react-datepicker--time-only .react-datepicker__time`, {
  borderRadius: '0.3rem',
})

globalStyle(
  `${root} .react-datepicker--time-only .react-datepicker__time-box`,
  {
    borderRadius: '0.3rem',
  },
)

globalStyle(`${root} .react-datepicker__triangle`, {
  position: 'absolute',
  left: '50px',
})

globalStyle(`${root} .react-datepicker-popper`, { zIndex: 1 })

globalStyle(`${root} .react-datepicker-popper[data-placement^="bottom"]`, {
  marginTop: '10px',
})

globalStyle(
  `${root} .react-datepicker-popper[data-placement="bottom-end"] .react-datepicker__triangle, .react-datepicker-popper[data-placement="top-end"] .react-datepicker__triangle`,
  {
    left: 'auto',
    right: '50px',
  },
)

globalStyle(`${root} .react-datepicker-popper[data-placement^="top"]`, {
  marginBottom: '10px',
})

globalStyle(`${root} .react-datepicker-popper[data-placement^="right"]`, {
  marginLeft: '8px',
})

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="right"] .react-datepicker__triangle`,
  {
    left: 'auto',
    right: '42px',
  },
)

globalStyle(`${root} .react-datepicker-popper[data-placement^="left"]`, {
  marginRight: '8px',
})

globalStyle(
  `${root} .react-datepicker-popper[data-placement^="left"] .react-datepicker__triangle`,
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
  borderTopRightRadius: '0.3rem',
  paddingTop: '8px',
  position: 'relative',
})

globalStyle(`${root} .react-datepicker__header--time`, {
  paddingBottom: '8px',
  paddingLeft: '5px',
  paddingRight: '5px',
})

globalStyle(
  `${root} .react-datepicker__year-dropdown-container--select, .react-datepicker__month-dropdown-container--select, .react-datepicker__month-year-dropdown-container--select, .react-datepicker__year-dropdown-container--scroll, .react-datepicker__month-dropdown-container--scroll, .react-datepicker__month-year-dropdown-container--scroll`,
  {
    display: 'inline-block',
    margin: '0 2px',
  },
)

globalStyle(
  `${root} .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header`,
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
  background: 'none',
  lineHeight: '1.7rem',
  textAlign: 'center',
  cursor: 'pointer',
  position: 'absolute',
  top: 10,
  padding: '0',
  border: '0.45rem solid transparent',
  zIndex: 1,
  width: 10,
  height: 10,
  textIndent: '-999em',
  overflow: 'hidden',
})

globalStyle(`${root} .react-datepicker__navigation--previous`, {
  left: '10px',
  borderRightColor: '#ccc',
})

globalStyle(`${root} .react-datepicker__navigation--previous:hover`, {
  borderRightColor: '#b3b3b3',
})

globalStyle(
  `${root} .react-datepicker__navigation--previous--disabled, .react-datepicker__navigation--previous--disabled:hover`,
  {
    borderRightColor: '#e6e6e6',
    cursor: 'default',
  },
)

globalStyle(`${root} .react-datepicker__navigation--next`, {
  right: '10px',
  borderLeftColor: '#ccc',
})

globalStyle(
  `${root} .react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button)`,
  {
    right: '80px',
  },
)

globalStyle(`${root} .react-datepicker__navigation--next:hover`, {
  borderLeftColor: '#b3b3b3',
})

globalStyle(
  `${root} .react-datepicker__navigation--next--disabled, .react-datepicker__navigation--next--disabled:hover`,
  {
    borderLeftColor: '#e6e6e6',
    cursor: 'default',
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
  borderTopColor: '#ccc',
})

globalStyle(`${root} .react-datepicker__navigation--years-previous:hover`, {
  borderTopColor: '#b3b3b3',
})

globalStyle(`${root} .react-datepicker__navigation--years-upcoming`, {
  top: '-4px',
  borderBottomColor: '#ccc',
})

globalStyle(`${root} .react-datepicker__navigation--years-upcoming:hover`, {
  borderBottomColor: '#b3b3b3',
})

globalStyle(`${root} .react-datepicker__month-container`, { float: 'left' })

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
  `${root} .react-datepicker__month .react-datepicker__month-text, .react-datepicker__month .react-datepicker__quarter-text`,
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
    width: '85px',
  },
)

globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type="time"]::-webkit-inner-spin-button, .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type="time"]::-webkit-outer-spin-button`,
  {
    WebkitAppearance: 'none',
    margin: '0',
  },
)

globalStyle(
  `${root} .react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input[type="time"]`,
  {
    MozAppearance: 'textfield',
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
  right: '-72px',
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
  },
)

globalStyle(
  `${root} .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list`,
  {
    listStyle: 'none',
    margin: '0',
    height: 'calc(195px + (1.7rem / 2))',
    overflowY: 'scroll',
    paddingRight: '0px',
    paddingLeft: '0px',
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

globalStyle(`${root} .react-datepicker__day-names, .react-datepicker__week`, {
  whiteSpace: 'nowrap',
})

globalStyle(
  `${root} .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name`,
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
  `${root} .react-datepicker__month--selected, .react-datepicker__month--in-selecting-range, .react-datepicker__month--in-range, .react-datepicker__quarter--selected, .react-datepicker__quarter--in-selecting-range, .react-datepicker__quarter--in-range`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#216ba5',
    color: '#fff',
  },
)

globalStyle(
  `${root} .react-datepicker__month--selected:hover, .react-datepicker__month--in-selecting-range:hover, .react-datepicker__month--in-range:hover, .react-datepicker__quarter--selected:hover, .react-datepicker__quarter--in-selecting-range:hover, .react-datepicker__quarter--in-range:hover`,
  {
    backgroundColor: '#1d5d90',
  },
)

globalStyle(
  `${root} .react-datepicker__month--disabled, .react-datepicker__quarter--disabled`,
  {
    color: '#ccc',
    pointerEvents: 'none',
  },
)

globalStyle(
  `${root} .react-datepicker__month--disabled:hover, .react-datepicker__quarter--disabled:hover`,
  {
    cursor: 'default',
    backgroundColor: 'transparent',
  },
)

globalStyle(
  `${root} .react-datepicker__day, .react-datepicker__month-text, .react-datepicker__quarter-text, .react-datepicker__year-text`,
  {
    cursor: 'pointer',
  },
)

globalStyle(
  `${root} .react-datepicker__day:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#f0f0f0',
  },
)

globalStyle(
  `${root} .react-datepicker__day--today, .react-datepicker__month-text--today, .react-datepicker__quarter-text--today, .react-datepicker__year-text--today`,
  {
    fontWeight: 'bold',
  },
)

globalStyle(
  `${root} .react-datepicker__day--highlighted, .react-datepicker__month-text--highlighted, .react-datepicker__quarter-text--highlighted, .react-datepicker__year-text--highlighted`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#3dcc4a',
    color: '#fff',
  },
)

globalStyle(
  `${root} .react-datepicker__day--highlighted:hover, .react-datepicker__month-text--highlighted:hover, .react-datepicker__quarter-text--highlighted:hover, .react-datepicker__year-text--highlighted:hover`,
  {
    backgroundColor: '#32be3f',
  },
)

globalStyle(
  `${root} .react-datepicker__day--highlighted-custom-1, .react-datepicker__month-text--highlighted-custom-1, .react-datepicker__quarter-text--highlighted-custom-1, .react-datepicker__year-text--highlighted-custom-1`,
  {
    color: 'magenta',
  },
)

globalStyle(
  `${root} .react-datepicker__day--highlighted-custom-2, .react-datepicker__month-text--highlighted-custom-2, .react-datepicker__quarter-text--highlighted-custom-2, .react-datepicker__year-text--highlighted-custom-2`,
  {
    color: 'green',
  },
)

globalStyle(
  `${root} .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#216ba5',
    color: '#fff',
  },
)

globalStyle(
  `${root} .react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover, .react-datepicker__month-text--selected:hover, .react-datepicker__month-text--in-selecting-range:hover, .react-datepicker__month-text--in-range:hover, .react-datepicker__quarter-text--selected:hover, .react-datepicker__quarter-text--in-selecting-range:hover, .react-datepicker__quarter-text--in-range:hover, .react-datepicker__year-text--selected:hover, .react-datepicker__year-text--in-selecting-range:hover, .react-datepicker__year-text--in-range:hover`,
  {
    backgroundColor: '#1d5d90',
  },
)

globalStyle(
  `${root} .react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected`,
  {
    borderRadius: '0.3rem',
    backgroundColor: '#2a87d0',
    color: '#fff',
  },
)

globalStyle(
  `${root} .react-datepicker__day--keyboard-selected:hover, .react-datepicker__month-text--keyboard-selected:hover, .react-datepicker__quarter-text--keyboard-selected:hover, .react-datepicker__year-text--keyboard-selected:hover`,
  {
    backgroundColor: '#1d5d90',
  },
)

globalStyle(
  `${root} .react-datepicker__day--in-selecting-range , .react-datepicker__month-text--in-selecting-range , .react-datepicker__quarter-text--in-selecting-range , .react-datepicker__year-text--in-selecting-range`,
  {
    backgroundColor: 'rgba(33, 107, 165, 0.5)',
  },
)

globalStyle(
  `${root} .react-datepicker__month--selecting-range .react-datepicker__day--in-range , .react-datepicker__month--selecting-range .react-datepicker__month-text--in-range , .react-datepicker__month--selecting-range .react-datepicker__quarter-text--in-range , .react-datepicker__month--selecting-range .react-datepicker__year-text--in-range`,
  {
    backgroundColor: '#f0f0f0',
    color: '#000',
  },
)

globalStyle(
  `${root} .react-datepicker__day--disabled, .react-datepicker__month-text--disabled, .react-datepicker__quarter-text--disabled, .react-datepicker__year-text--disabled`,
  {
    cursor: 'default',
    color: '#ccc',
  },
)

globalStyle(
  `${root} .react-datepicker__day--disabled:hover, .react-datepicker__month-text--disabled:hover, .react-datepicker__quarter-text--disabled:hover, .react-datepicker__year-text--disabled:hover`,
  {
    backgroundColor: 'transparent',
  },
)

globalStyle(
  `${root} .react-datepicker__month-text.react-datepicker__month--selected:hover, .react-datepicker__month-text.react-datepicker__month--in-range:hover, .react-datepicker__month-text.react-datepicker__quarter--selected:hover, .react-datepicker__month-text.react-datepicker__quarter--in-range:hover, .react-datepicker__quarter-text.react-datepicker__month--selected:hover, .react-datepicker__quarter-text.react-datepicker__month--in-range:hover, .react-datepicker__quarter-text.react-datepicker__quarter--selected:hover, .react-datepicker__quarter-text.react-datepicker__quarter--in-range:hover`,
  {
    backgroundColor: '#216ba5',
  },
)

globalStyle(
  `${root} .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover`,
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
  `${root} .react-datepicker__year-read-view, .react-datepicker__month-read-view, .react-datepicker__month-year-read-view`,
  {
    border: '1px solid transparent',
    borderRadius: '0.3rem',
  },
)

globalStyle(
  `${root} .react-datepicker__year-read-view:hover, .react-datepicker__month-read-view:hover, .react-datepicker__month-year-read-view:hover`,
  {
    cursor: 'pointer',
  },
)

globalStyle(
  `${root} .react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow, .react-datepicker__year-read-view:hover .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-read-view:hover .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view:hover .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view:hover .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-year-read-view:hover .react-datepicker__month-read-view--down-arrow`,
  {
    borderTopColor: '#b3b3b3',
  },
)

globalStyle(
  `${root} .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow`,
  {
    borderTopColor: '#ccc',
    float: 'right',
    marginLeft: '20px',
    top: '8px',
    position: 'relative',
    borderWidth: '0.45rem',
  },
)

globalStyle(
  `${root} .react-datepicker__year-dropdown, .react-datepicker__month-dropdown, .react-datepicker__month-year-dropdown`,
  {
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    width: '50%',
    left: '25%',
    top: '30px',
    zIndex: 1,
    textAlign: 'center',
    borderRadius: '0.3rem',
    border: '1px solid #aeaeae',
  },
)

globalStyle(
  `${root} .react-datepicker__year-dropdown:hover, .react-datepicker__month-dropdown:hover, .react-datepicker__month-year-dropdown:hover`,
  {
    cursor: 'pointer',
  },
)

globalStyle(
  `${root} .react-datepicker__year-dropdown--scrollable, .react-datepicker__month-dropdown--scrollable, .react-datepicker__month-year-dropdown--scrollable`,
  {
    height: '150px',
    overflowY: 'scroll',
  },
)

globalStyle(
  `${root} .react-datepicker__year-option, .react-datepicker__month-option, .react-datepicker__month-year-option`,
  {
    lineHeight: '20px',
    width: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
)

globalStyle(
  `${root} .react-datepicker__year-option:first-of-type, .react-datepicker__month-option:first-of-type, .react-datepicker__month-year-option:first-of-type`,
  {
    borderTopLeftRadius: '0.3rem',
    borderTopRightRadius: '0.3rem',
  },
)

globalStyle(
  `${root} .react-datepicker__year-option:last-of-type, .react-datepicker__month-option:last-of-type, .react-datepicker__month-year-option:last-of-type`,
  {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    borderBottomLeftRadius: '0.3rem',
    borderBottomRightRadius: '0.3rem',
  },
)

globalStyle(
  `${root} .react-datepicker__year-option:hover, .react-datepicker__month-option:hover, .react-datepicker__month-year-option:hover`,
  {
    backgroundColor: '#ccc',
  },
)

globalStyle(
  `${root} .react-datepicker__year-option:hover .react-datepicker__navigation--years-upcoming, .react-datepicker__month-option:hover .react-datepicker__navigation--years-upcoming, .react-datepicker__month-year-option:hover .react-datepicker__navigation--years-upcoming`,
  {
    borderBottomColor: '#b3b3b3',
  },
)

globalStyle(
  `${root} .react-datepicker__year-option:hover .react-datepicker__navigation--years-previous, .react-datepicker__month-option:hover .react-datepicker__navigation--years-previous, .react-datepicker__month-year-option:hover .react-datepicker__navigation--years-previous`,
  {
    borderTopColor: '#b3b3b3',
  },
)

globalStyle(
  `${root} .react-datepicker__year-option--selected, .react-datepicker__month-option--selected, .react-datepicker__month-year-option--selected`,
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
  padding: '0px 6px 0px 0px',
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
  content: '"\\00d7"',
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
  zIndex: 2147483647,
})

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__day-name, .react-datepicker__portal .react-datepicker__day, .react-datepicker__portal .react-datepicker__time-name`,
  {
    width: '3rem',
    lineHeight: '3rem',
  },
)

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__current-month, .react-datepicker__portal .react-datepicker-time__header`,
  {
    fontSize: '1.44rem',
  },
)

globalStyle(`${root} .react-datepicker__portal .react-datepicker__navigation`, {
  border: '0.81rem solid transparent',
})

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__navigation--previous`,
  {
    borderRightColor: '#ccc',
  },
)

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__navigation--previous:hover`,
  {
    borderRightColor: '#b3b3b3',
  },
)

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__navigation--previous--disabled, .react-datepicker__portal .react-datepicker__navigation--previous--disabled:hover`,
  {
    borderRightColor: '#e6e6e6',
    cursor: 'default',
  },
)

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__navigation--next`,
  {
    borderLeftColor: '#ccc',
  },
)

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__navigation--next:hover`,
  {
    borderLeftColor: '#b3b3b3',
  },
)

globalStyle(
  `${root} .react-datepicker__portal .react-datepicker__navigation--next--disabled, .react-datepicker__portal .react-datepicker__navigation--next--disabled:hover`,
  {
    borderLeftColor: '#e6e6e6',
    cursor: 'default',
  },
)
