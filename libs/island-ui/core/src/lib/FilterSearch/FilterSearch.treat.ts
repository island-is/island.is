import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'


const rootOrg = {
  fontFamily: 'IBM Plex Sans',
  borderRadius: 5,
  marginTop: 10,
  padding: 24,
}

export const root = style({
  ...rootOrg,
  minWidth: 220,
  marginBottom: 30,
})

export const rootMobile = style({
  ...rootOrg,
  marginBottom: 20,
  marginLeft: -10,
  marginRight: 10,
})


export const filterItem = style({
    marginTop: 0,
})

export const inputSearch = style({
  marginBottom: 20,
})

export const clear = style({
  textDecorationLine: 'underline',
  marginTop: 5,
  marginBottom: 5,
  color: theme.color.blue400,
  fontSize: 14,
  lineHeight:'16px',
  display: 'flex',
  justifyContent: 'flex-end',
  cursor: 'pointer',
  
})

export const clearIcon = style({
  marginLeft:4,
  marginRight:2
})

