import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const serviceList = style ({
    display: 'flex',  
    flexWrap: 'wrap',
    minHeight: 350
})

const filterOrg = {
  background:theme.color.blue100,
  fontFamily:'IBM Plex Sans',
  borderRadius:5,
  marginTop:10,
  padding:24,
  minWidth:220
}

export const filter = style({
  background:filterOrg.background,
  fontFamily:filterOrg.fontFamily,
  borderRadius:filterOrg.borderRadius,
  marginTop:filterOrg.marginTop,
  padding:filterOrg.padding,
  minWidth:filterOrg.minWidth
})
export const accordionMobile = style({
  marginLeft:24,
  width:412

})

export const filterMobile = style({
  background:filterOrg.background,
  fontFamily:filterOrg.fontFamily,
  borderRadius:filterOrg.borderRadius,
  marginTop:filterOrg.marginTop,
  padding:filterOrg.padding,
  minWidth:filterOrg.minWidth,
  width:432,
  marginBottom:20,
  marginLeft:-10,
  marginRight:10,
})

export const filterItem = style({
  marginTop:0
})

export const inputSearch = style({
  marginBottom:20
})

export const navigation = style({
  height:60,
  marginBottom:80,
  marginLeft:10,
  fontFamily:theme.typography.fontFamily,
  borderColor:theme.color.blue200,
  borderWidth:1,
  borderStyle:'solid',
  textAlign:'center',
  display:'flex',
  justifyContent: 'center',
  flexDirection: 'column'
})

export const navigationMobile = style({
  height:60,
  fontFamily:theme.typography.fontFamily,
  borderColor:theme.color.blue200,
  borderWidth:1,
  borderStyle:'solid',
  textAlign:'center',
  display:'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  width:432,
  marginBottom:20,
  marginLeft:10,
  marginRight:10,
})

export const displayInline = style({
  display:'inline'
})
export const displayHidden = style({
  display:'none'
})


export const radioButton = style({
  marginTop:5
})

export const topSectionText = style({
  fontSize:24,
  margin: 'auto',
  padding: 10,
  maxWidth:600
})

export const topSection = style({
  marginBottom:40,
  textAlign:'center'
})

export const serviceLayoutMobile = style({
  flexDirection:'column-reverse',
})
