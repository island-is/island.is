import { globalStyle, style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const twoColumnSliceContent = style({
  marginTop: 18,
})

globalStyle(
  `${twoColumnSliceContent} p, ${twoColumnSliceContent} span, ${twoColumnSliceContent} ul`,
  {
    fontWeight: 300,
    fontSize: 18,
    lineHeight: 32 / 18,
  },
)

globalStyle(`${twoColumnSliceContent} ul`, {
  marginLeft: 18,
})
