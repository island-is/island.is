import { style} from 'treat'
//import { theme } from '@island.is/island-ui/theme'


export const root = style({
  display:'inline'
})

export const spacingSmall = style({
  paddingLeft:0
})

export const spacingMedium = style({
  paddingLeft:10
})

export const spacingLarge = style({
  paddingLeft:30,
})

export const bullet = style({
    pointerEvents: 'none',
    transition: 'top 150ms ease',
    position: 'relative',
    left: -1,
})
  