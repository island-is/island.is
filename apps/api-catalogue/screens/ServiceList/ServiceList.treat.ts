import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'


const bottomRootBase = {
  background:theme.color.blue100,
  paddingTop:33,
  paddingLeft:48,
  paddingRight:24,
}

export const bottomRoot = style({
  ...bottomRootBase,
  paddingLeft:48,
})

export const bottomRootMobile = style({
  ...bottomRootBase,
  paddingLeft:24,
})

export const bottomHeading = style({
  fontWeight:600,
  color:theme.color.blue600,
  fontStyle:'normal',
  fontSize:20,
  lineHeight:'30px',
  paddingLeft:24
})

const leftAndRightBase = {
}


export const leftAndRight = style({
    ...leftAndRightBase,
    display:'flex',
})


export const leftAndRightMobile = style({
  ...leftAndRightBase,
})
export const serviceList = style({
  display: 'flex',
  flexWrap: 'wrap',
  minHeight: 350,
  flexDirection: 'row',
})

export const serviceListMobile = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: 350,
  justifyContent: 'space-between',
})

const filterOrg = {
  background: theme.color.blue100,
  fontFamily: 'IBM Plex Sans',
  borderRadius: 5,
  marginTop: 10,
  padding: 24,
  minWidth: 220,
}

export const filterMobile = style({
  background: filterOrg.background,
  fontFamily: filterOrg.fontFamily,
  borderRadius: filterOrg.borderRadius,
  marginTop: filterOrg.marginTop,
  padding: filterOrg.padding,
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

const navigationOrg = {
  width: 310,
  height: 144,
  borderWidth: 1,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderStyle: 'solid',
  display: 'flex',
  justifyContent: 'center',
}
export const navigation = style({
  width: navigationOrg.width,
  height: navigationOrg.height,
  fontFamily: navigationOrg.fontFamily,
  borderColor: navigationOrg.borderColor,
  borderWidth: navigationOrg.borderWidth,
  borderStyle: navigationOrg.borderStyle,
  display: navigationOrg.display,
  justifyContent: navigationOrg.justifyContent,
  textAlign: 'center',
  flexDirection: 'column',
  marginBottom: 80,
  ':hover': {
    borderColor: theme.color.blue400,
    textDecoration: 'none',
    cursor: 'pointer',
  },
})

export const navigationMobile = style({
  width: navigationOrg.width,
  height: navigationOrg.height,
  fontFamily: navigationOrg.fontFamily,
  borderColor: navigationOrg.borderColor,
  borderWidth: navigationOrg.borderWidth,
  borderStyle: navigationOrg.borderStyle,
  display: navigationOrg.display,
  justifyContent: navigationOrg.justifyContent,
  textAlign: 'center',
  flexDirection: 'column',
  marginBottom: 20,
  marginRight: 20,
  ':hover': {
    borderColor: theme.color.blue400,
    textDecoration: 'none',
    cursor: 'pointer',
  },
})

export const navigationText = style({
  fontSize: 18,
  color: theme.color.blue400,
  fontWeight: 600,
})

export const displayInline = style({
  display: 'inline',
})
export const displayHidden = style({
  display: 'none',
})

export const radioButton = style({
  marginTop: 5,
})


const spinOrg = {
  lineHeight: 0,
  '@keyframes': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  },
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
  animationDuration: '1.5s',
}

export const spin = style(spinOrg)
export const loadingIcon = style({
  width: 32,
  height: 32,
  color: theme.color.blue600,
  ...spinOrg,
})
