import { style } from '@vanilla-extract/css'

export const childNodeContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '12px',
})

export const addNodeButtonContainer = style({
  display: 'flex',
  justifyContent: 'center',
  border: '1px dashed #d3dce0',
  padding: '10px 4px',
  borderRadius: '6px',
})

export const languageSelector = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '12px',
  justifyContent: 'flex-end',
})

export const languageSelectorContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '4px',
  alignItems: 'flex-end',
  marginBottom: '16px',
})

export const statusSelectorContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '4px',

  marginBottom: '16px',
})

export const statusSelector = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '12px',
  justifyContent: 'flex-end',
})

export const topRowContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '12px',
  justifyContent: 'space-between',
})

export const modeSelectorContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '4px',
  marginBottom: '16px',
})

export const modeSelector = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '12px',
})
