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
})

export const nodeInnerContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  width: '100%',
  height: '100%',
  paddingBottom: '10px',
})

export const contentContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '8px',
  alignItems: 'center',
  paddingLeft: '8px',
})

export const childNodeContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '8px',
})

export const nodeTopRowContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '32px',
  borderBottom: '1px solid rgb(231, 235, 238)',
  marginBottom: '8px',
})

export const nodeTopRowContainerLeft = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '4px',
  alignItems: 'center',
})

export const fullWidth = style({
  width: '100%',
})

export const nodeTopRowContainerRight = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '8px',
  alignItems: 'center',
})

export const tooltipContent = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '8px',
  padding: '8px',
})
