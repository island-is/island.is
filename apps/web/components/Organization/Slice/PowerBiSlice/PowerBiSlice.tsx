import { PowerBIEmbed } from 'powerbi-client-react'
import { PowerBiSlice as PowerBiSliceSchema } from '@island.is/web/graphql/schema'

interface PowerBiSliceProps {
  slice: PowerBiSliceSchema
}

export const PowerBiSlice = ({ slice }: PowerBiSliceProps) => {
  const embedProps = slice?.powerBiEmbedProps ?? {}
  return <PowerBIEmbed embedConfig={{ type: 'report', ...embedProps }} />
}

export default PowerBiSlice
