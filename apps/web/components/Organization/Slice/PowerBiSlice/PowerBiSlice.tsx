import { PowerBIEmbed } from 'powerbi-client-react'

interface PowerBiSliceProps {
  embedPropsString: string
}

export const PowerBiSlice = ({ embedPropsString }: PowerBiSliceProps) => {
  try {
    const embedProps = JSON.parse(embedPropsString)
    return <PowerBIEmbed embedConfig={{ type: 'report', ...embedProps }} />
  } catch (err) {
    console.error(err)
    return null
  }
}

export default PowerBiSlice
