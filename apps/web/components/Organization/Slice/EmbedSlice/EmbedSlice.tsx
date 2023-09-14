import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { Embed as EmbedSchema } from '@island.is/web/graphql/schema'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './EmbedSlice.css'

type ScreenWidthString = ReturnType<typeof getScreenWidthString>

const heightMap: Record<ScreenWidthString, number> = {
  xl: 650,
  lg: 800,
  md: 550,
  sm: 600,
  xs: 450,
}

const screenWidthTraversalMap: Record<ScreenWidthString, ScreenWidthString> = {
  xl: 'xl',
  lg: 'xl',
  md: 'lg',
  sm: 'md',
  xs: 'sm',
}

interface EmbedSliceProps {
  slice: EmbedSchema
}

export const EmbedSlice = ({ slice }: EmbedSliceProps) => {
  const { width } = useWindowSize()

  const screenWidthString = getScreenWidthString(width)

  // TODO: add a config json field that stores the height map as well as the scale factor (1.5 below)

  const offset = Math.round(
    (theme.breakpoints[screenWidthTraversalMap[screenWidthString]] - width) /
      1.5,
  )

  return (
    <iframe
      className={styles.container}
      src={slice.embedUrl}
      title={slice.altText}
      allowFullScreen={true}
      width="100%"
      height={
        heightMap[screenWidthString] - (screenWidthString === 'xl' ? 0 : offset)
      }
    />
  )
}
