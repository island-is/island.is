import { style } from 'treat';
import { theme } from '@island.is/island-ui/theme';


export const homePage = style ({
  position: 'relative',
  maxWidth: 1440,
  margin: 'auto'
})

export const homePageMobile = style ({
  position: 'relative',
  maxWidth: '100%',
  margin: 'auto'
})

export const imageMobile = style({
  display: 'none'
})

export const cards = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly'
})