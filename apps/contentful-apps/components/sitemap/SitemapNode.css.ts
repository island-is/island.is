import { style } from '@vanilla-extract/css'

export { addNodeButtonContainer } from './SitemapTreeField.css'

export const mainContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '8px',
  userSelect: 'none',
})

export const nodeContainer = style({
  border: '1px solid #d3dce0',
  padding: '10px 4px',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  borderRadius: '6px',
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
