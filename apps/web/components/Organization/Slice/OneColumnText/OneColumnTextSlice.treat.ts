import { globalStyle, style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const oneColumnSliceContent = style({
  marginTop: 18,
})

globalStyle(
  `${oneColumnSliceContent} p, ${oneColumnSliceContent} span, ${oneColumnSliceContent} ul`,
  {
    fontWeight: 300,
    fontSize: 18,
    lineHeight: 32 / 18,
  },
)

globalStyle(`${oneColumnSliceContent} ul`, {
  marginLeft: 24,
})

globalStyle(`${oneColumnSliceContent} li`, {
  listStyle: 'inside',
})
