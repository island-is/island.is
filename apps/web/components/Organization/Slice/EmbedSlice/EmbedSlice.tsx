import { Embed as EmbedSchema } from '@island.is/web/graphql/schema'

import * as styles from './EmbedSlice.css'

interface EmbedSliceProps {
  slice: EmbedSchema
}

export const EmbedSlice = ({ slice }: EmbedSliceProps) => {
  return (
    <iframe
      className={styles.container}
      src={slice.embedUrl}
      title={'Hér er titill'}
    ></iframe>
  )
}
