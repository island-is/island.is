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
    marginTop: 0,
    background: 'white',
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:theme.color.blue200,
    padding:24,
    fontSize:18,
    color:theme.color.dark400,
    fontWeight:600,
    minWidth:318
    
})

export const groupItemMobile = style({
  marginTop: 20,
  background: 'white',
  borderWidth:1,
  borderStyle:'solid',
  borderColor:theme.color.blue200,
  borderRadius:5,
  fontSize:50,
  color:theme.color.dark400,
  fontWeight:600,
  paddingTop:19,
  paddingBottom:19,
  paddingLeft:16,
  paddingRight:16
})

export const filterGroupItem = style({
  marginTop:-10,
  marginBottom: 15,
})
