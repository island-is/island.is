import { theme } from '@island.is/island-ui/theme';
import { style } from 'treat';

export const wrapper = style({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 9998,

  padding: theme.spacing['2'],
  width: 600,

  backgroundColor: theme.color.white,
  boxShadow: '1px 0 24px 4px rgba(0, 0, 0, 0.1)',
})
