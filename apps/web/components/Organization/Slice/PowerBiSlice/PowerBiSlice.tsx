import { PowerBIEmbed } from 'powerbi-client-react'
import { Embed } from 'powerbi-client'
import { PowerBiSlice as PowerBiSliceSchema } from '@island.is/web/graphql/schema'
import * as styles from './PowerBiSlice.css'

interface PowerBiSliceProps {
  slice: PowerBiSliceSchema
}

export const PowerBiSlice = ({ slice }: PowerBiSliceProps) => {
  const getEmbeddedComponent = (embed: Embed) => {
    if (slice?.powerBiEmbedProps?.height) {
      embed.element.style.height = slice.powerBiEmbedProps.height
    }
  }

  const embedProps = slice?.powerBiEmbedProps ?? {}
  return (
    <PowerBIEmbed
      embedConfig={{ type: 'report', ...embedProps }}
      cssClassName={styles.container}
      getEmbeddedComponent={getEmbeddedComponent}
    />
  )
}

export default PowerBiSlice
