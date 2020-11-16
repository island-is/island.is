import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { borderBottomWidth } from '../Box/useBoxStyles.treat'

const filterOrg = {
  background: 'white',
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

export const groupItem = style({
    background: 'white',
    marginTop:24,
    marginLeft:24,
    marginRight:24,
    paddingBottom:24,
    fontSize:18,
    color:theme.color.dark400,
    fontWeight:600,
    minWidth:318,
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:theme.color.blue200,
    
})

export const groupItemMobile = style({
  marginTop: 20,
  borderWidth:1,
  borderStyle:'solid',
  borderColor:theme.color.blue200,
  background:theme.color.white,
  borderRadius:5,
  paddingTop:19,
  paddingBottom:19,
  paddingLeft:16,
  paddingRight:16
})

export const filterGroupItem = style({
  marginTop:-10,
  marginBottom: 15,
})
