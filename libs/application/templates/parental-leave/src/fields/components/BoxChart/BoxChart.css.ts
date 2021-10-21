import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const BoxGrid = style({
  display: 'grid',
  gridColumnGap: '1px',
  gridTemplateRows: 32,
  position: 'relative',
})

export const box = style({
  position: 'relative',
})

export const bullet = style({
  borderRadius: 2,
  height: '16px',
  position: 'relative',
  top: '-1px',
  width: '16px',
})

export const blue = style({
  backgroundColor: theme.color.blue400,
})

export const green = style({
  backgroundColor: theme.color.mint400,
})

export const gray = style({
  backgroundColor: theme.color.dark200,
})

export const dashedLines = style({
  background: `repeating-linear-gradient(-45deg, #fff, #fff 5%, rgba(255, 255, 255, 0.25) 5%, rgba(255, 255, 255, 0.5) 50%, #fff 50%) top left fixed`,
  backgroundSize: '10px 10px',
  bottom: 0,
  height: '100%',
  left: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
})
