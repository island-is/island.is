import { style } from '@vanilla-extract/css'

export { addNodeButtonContainer } from './SitemapTreeField.css'

export const mainContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '12px',
})

export const nodeContainer = style({
  border: '1px solid #d3dce0',
  borderRadius: '6px',
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '8px',
})

export const nodeInnerContainer = style({
  padding: '10px 4px',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  width: '100%',
})

export const contentContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '8px',
  alignItems: 'center',
})

export const childNodeContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '8px',
})
