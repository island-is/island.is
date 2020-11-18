import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const extraNarrowWidth = 300;

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


export const wideIconButton = style({
  width:'100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height:44,
  cursor: 'pointer',
  padding:16,
})

export const rootMobile = style({
  marginTop: 17,
  marginBottom: 32,
  marginLeft:24,
  marginRight:24,
  background:theme.color.white,
  borderRadius:8,
})

export const filterContentMobile = style({
  top:0,
  left:0,
  paddingTop:42,
  paddingBottom:200,
  width:'100%',
  minHeight:'100%',
  zIndex:1000,
  position:'absolute',
  background:theme.color.white,
  paddingRight:40,
  paddingLeft: 40,
  '@media': {
    [`screen and (max-width: ${extraNarrowWidth}px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
})

export const labelResultButton = style({
  display: 'flex',
  justifyContent: 'center',
  paddingTop:24,
  paddingBottom:48,
  background:theme.color.blue100,
  marginTop:24,
  marginLeft:-40,
  position:'fixed',
  zIndex:1001,
  bottom:0,
  width:'100%'
  
})

export const mobileCloseButton = style({
  marginBottom:18,
})


export const groupContainer = style({
    marginTop: 0,
    background:theme.color.white,
    paddingTop:3,
    borderRadius:8
})
export const groupContainerMobile = style({
  marginTop: 0,
  paddingTop:3,
  borderRadius:8,  
  
})

export const inputSearch = style({
  marginBottom: 20,
})

export const clear = style({
  paddingTop:12,
  position: 'relative',
  float: 'right'
})


