import { globalStyle, style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const oneColumnSliceTitle = style({
  height: 34,
  fontWeight: 600,
  fontSize: 24,
  lineHeight: 28 / 20,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 24,
      lineHeight: 34 / 24,
    },
  }),
})

export const oneColumnSliceContent = style({
  marginTop: 18,
})

globalStyle(
  `${oneColumnSliceContent} p, ${oneColumnSliceContent} span, ${oneColumnSliceContent} ul`,
  {
    fontWeight: 300,
    fontSize: 18,
    lineHeight: 32 / 18,
    marginBottom: 36,
  },
)

globalStyle(`${oneColumnSliceContent} li`, {
  listStyle: 'inside',
})
