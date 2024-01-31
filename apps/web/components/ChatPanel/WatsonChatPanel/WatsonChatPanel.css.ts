import { style } from '@vanilla-extract/css'

export const feedbackPanelContainer = style({
  position: 'fixed',
  zIndex: 1200,
  bottom: 20,
  right: 20,
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.16)',
})
