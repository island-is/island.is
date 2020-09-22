import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const serviceList = style ({
    display: 'flex',  
    flexWrap: 'wrap',
    alignItems:'center'
})

export const filter = style({
  background:theme.color.blue100,
  fontFamily:'IBM Plex Sans',
  borderRadius:5,
  marginTop:10,
  padding:24,
  minWidth:220
})

export const filterItem = style({
  marginTop:0
})

export const inputSearch = style({
  marginBottom:20
})

export const navigation = style({
  padding:50,
  textAlign: 'center',
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