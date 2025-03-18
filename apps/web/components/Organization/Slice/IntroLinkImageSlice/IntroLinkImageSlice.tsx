import type { IntroLinkImage } from '@island.is/web/graphql/schema'

import { IntroLinkImageComponent } from '../IntroLinkImageComponent/IntroLinkImageComponent'

interface IntroLinkImageSliceProps {
  slice: IntroLinkImage
}

export const IntroLinkImageSlice = ({ slice }: IntroLinkImageSliceProps) => {
  return (
    <IntroLinkImageComponent
      id={slice.id}
      item={{ ...slice, intro: slice.introHtml }}
    />
  )
}
