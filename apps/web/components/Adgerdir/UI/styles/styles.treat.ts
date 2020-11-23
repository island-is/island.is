import { globalStyle, style, styleMap } from 'treat'
import colors from '../colors'

export const bg = style({
  backgroundColor: colors.green100,
})

export const white = style({})

export const frontpageBg = style({
  background: `url(/covid/bg.jpg) center center no-repeat`,
  backgroundSize: 'cover',
})

export const focusableBorderColor = styleMap({
  green: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.green200,
  },
  blue: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.blue200,
  },
})

export const text = style({
  color: colors.green400,
})

export const textColor = styleMap({
  green: {
    color: colors.green400,
  },
  blue: {
    color: colors.blue400,
  },
})

export const divider = style({
  height: 1,
  width: '100%',
  backgroundColor: colors.green200,
})

export const iconColor = style({
  fill: colors.green400,
})

globalStyle(`${iconColor} circle `, {
  fill: colors.green400,
})

globalStyle(`${iconColor} path, ${iconColor} line`, {
  stroke: colors.green400,
})

globalStyle(`${white} *`, {
  color: 'white',
  fill: 'white',
})
