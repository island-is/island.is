import { Box } from '@island.is/island-ui/core'
import type { Embed as EmbedSchema } from '@island.is/web/graphql/schema'

import * as styles from './EmbedSlice.css'

const calculatePaddingBottom = (aspectRatio: string) => {
  const [width, height] = aspectRatio.split('/')
  return `${(Number(height) / Number(width)) * 100}%`
}

interface EmbedSliceProps {
  slice: EmbedSchema
}

export const EmbedSlice = ({ slice }: EmbedSliceProps) => {
  return (
    <Box
      className={styles.container}
      style={{
        paddingBottom: calculatePaddingBottom(slice.aspectRatio ?? '16/9'),
      }}
    >
      <iframe
        className={styles.responsiveIframe}
        src={slice.embedUrl ?? ''}
        title={slice.altText ?? ''}
        allowFullScreen={true}
      />
    </Box>
  )
}
