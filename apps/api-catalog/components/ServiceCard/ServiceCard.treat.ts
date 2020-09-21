import { style} from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
    width:432,
    marginBottom:20,
    marginLeft:20,
    fontFamily:theme.typography.fontFamily,
    borderColor:theme.color.blue200,
    borderWidth:1,
    borderStyle:'solid',
    boxSizing:'border-box'
})

export const name = style({   
    fontSize:24,
    color:theme.color.blue400,
    fontWeight:600,
})

export const owner = style({
    fontSize:18,
    color:theme.color.dark400,
    fontWeight:300
})

export const serviceStatus = style({
    position:'relative',
    top:-32,
    left:370
})


export const sharedStyles = style({
      
      borderRadius:5,
      paddingTop:5,
      paddingBottom:3,
      paddingLeft:15,
      paddingRight:15,
      marginRight:10,
      fontSize:14,
      marginBottom:3,
      minWidth:40,
      color:theme.color.blue400,
      background:theme.color.blue100
      
})


export const category = style({
    display:'flex',
    flexWrap:'wrap',
    background:theme.color.white,
    paddingLeft:5,
    paddingRight:5,
    borderBottomLeftRadius:7,
    borderBottomRightRadius:7,
    paddingTop:5,
    paddingBottom:2,
    fontWeight:600
})


export const cardTexts = style({
    paddingLeft:32,
    paddingRight:32,
    paddingTop:24,
    paddingBottom:24
})
