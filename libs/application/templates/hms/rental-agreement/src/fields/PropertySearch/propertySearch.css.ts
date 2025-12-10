import { style } from '@vanilla-extract/css'

const tableCellPadding = '24px 16px'
const tableCellFontSize = '16px'

export const input = style({
  width: '100%',
  padding: '10px',
  fontSize: '14px',
  textAlign: 'right',
  border: '1px solid #CCDFFF',
  borderRadius: '8px',
})

export const inputError = style({
  borderColor: '#D50000',
  backgroundColor: '#FDE8E8',
})

export const sizeInput = style({
  marginRight: '4px',
})

export const noInputArrows = style({
  appearance: 'textfield',
  MozAppearance: 'textfield',
  selectors: {
    '&::-webkit-outer-spin-button': {
      appearance: 'none',
    },
    '&::-webkit-inner-spin-button': {
      appearance: 'none',
    },
  },
})

export const tableHeadingCell = style({
  padding: tableCellPadding,
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'left',
})

export const tableCell = style({
  padding: tableCellPadding,
  fontSize: tableCellFontSize,
  textAlign: 'left',
})

export const dropdownTableCell = style({
  padding: '16px',
  fontSize: tableCellFontSize,
  textAlign: 'left',
})

export const tableCellExpand = style({
  minWidth: '56px',
  textAlign: 'center',
})

export const tableCellFastNum = style({
  width: '70%',
  textAlign: 'left',
})

export const tableCellMerking = style({
  width: '30%',
  textAlign: 'left',
})

export const tableCellSize = style({
  minWidth: '130px',
  textAlign: 'right',
  whiteSpace: 'nowrap',
})

export const tableCellNumOfRooms = style({
  minWidth: '88px',
  textAlign: 'right',
})

export const hiddenTableRow = style({
  backgroundColor: '#f2f7ff',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  maxHeight: 0,
  opacity: 0,
})

export const hiddenTableRowExpanded = style({
  maxHeight: '300px',
  opacity: 1,
})
