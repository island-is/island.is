import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrapperGrowHeightDesktop = style({
  width: 432,
})
export const wrapperGrowHeightMobile = style({
  width: 327,
})

export const wrapperFixedSizeDesktop = style({
  width: 432,
  height: 163,
})
export const wrapperFixedSizeMobile = style({
  width: 327,
  height: 163,
})

const wrapperOrg = {
  marginBottom: 20,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 20,
}
const errorColor = theme.color.red400
export const wrapper = style(wrapperOrg)
export const wrapperNoBorder = style({
  ...wrapperOrg,
  ...{
    borderColor: theme.color.transparent,
  },
})

export const wrapperError = style({
  ...wrapperOrg,
  ...{
    borderColor: theme.color.red200,
  },
})

export const cardTexts = style({
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24,
  paddingBottom: 24,
})

const titleOrgDesktop = {
  fontSize: 24,
  color: theme.color.blue400,
  fontWeight: 600,
}
const titleOrgMobile = {
  fontSize: 20,
  color: theme.color.blue400,
  fontWeight: 600,
}

export const title = style(titleOrgDesktop)
export const titleMobile = style(titleOrgMobile)

export const titleErrorDesktop = style({
  ...titleOrgDesktop,
  ...{
    color: errorColor,
  },
})
export const titleErrorMobile = style({
  ...titleOrgMobile,
  ...{
    color: errorColor,
  },
})

const textOrgDesktop = {
  fontSize: 18,
  color: theme.color.dark400,
  fontWeight: 300,
}
const textOrgMobile = {
  fontSize: 16,
  color: theme.color.dark400,
  fontWeight: 300,
  paddingTop: 2,
}

export const text = style(textOrgDesktop)
export const textMobile = style(textOrgMobile)

export const textErrorDesktop = style({
  ...textOrgDesktop,
  ...{
    color: errorColor,
  },
})
export const textErrorMobile = style({
  ...textOrgMobile,
  ...{
    color: errorColor,
  },
})

export const displayHidden = style({
  display: 'none',
})
