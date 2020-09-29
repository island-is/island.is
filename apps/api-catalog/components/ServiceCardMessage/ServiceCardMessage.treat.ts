import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const wrapperOrg = {
  width: 432,
  marginBottom: 20,
  marginLeft: 10,
  marginRight: 10,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  height: 200,
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
  paddingLeft: 32,
  paddingRight: 32,
  paddingTop: 24,
  paddingBottom: 24,
})

const titleOrg = {
  fontSize: 24,
  color: theme.color.blue400,
  fontWeight: 600,
}
export const title = style(titleOrg)
export const titleError = style({
  ...titleOrg,
  ...{
    color: errorColor,
  },
})

const textOrg = {
  fontSize: 18,
  color: theme.color.dark400,
  fontWeight: 300,
}

export const text = style(textOrg)

export const textError = style({
  ...textOrg,
  ...{
    color: errorColor,
  },
})
