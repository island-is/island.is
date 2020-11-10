import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const filterOrg = {
  background: theme.color.blue100,
  fontFamily: 'IBM Plex Sans',
  borderRadius: 5,
  marginTop: 10,
  padding: 24,
  minWidth: 220,
}

export const filter = style({
  background: filterOrg.background,
  fontFamily: filterOrg.fontFamily,
  borderRadius: filterOrg.borderRadius,
  marginTop: filterOrg.marginTop,
})

export const filterItem = style({
    marginTop: 0,
})

export const categoryCheckbox = style({
  marginTop: 5,
})
