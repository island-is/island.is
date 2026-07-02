import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const accordionItemWrapper = style({})

globalStyle(`${accordionItemWrapper} > div > div:first-child`, {
  borderRadius: theme.border.radius.standard,
  padding: `${theme.spacing[1]}px ${theme.spacing[2]}px`,
})

export const selectedAccordionItem = style({})

globalStyle(`${selectedAccordionItem} > div > div:first-child`, {
  background: theme.color.blue100,
})
