import { useRef } from 'react'
import { PowerBIEmbed } from 'powerbi-client-react'
import { type Embed, models } from 'powerbi-client'

export const PowerBI = () => {
  const embedRef = useRef<Embed | null>(null)

  const getEmbeddedComponent = (embed: Embed) => {
    embed.element.style.height = '700px'
    embed.element.style.width = '100%'
    embed.iframe.style.border = 'none'
    embedRef.current = embed
  }

  return (
    <>
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          tokenType: models.TokenType.Embed,
          embedUrl:
            'https://app.powerbi.com/view?r=eyJrIjoiMDI0YjI2MjAtOGZlOC00YzVkLWE1YjktYjczMGM5NTYxOGUzIiwidCI6ImJjMTRhNDRlLWUwZmItNGUwYi1hNTM1LTEwMDU3OWQ0MWI2NSIsImMiOjh9',
          settings: {
            layoutType: models.LayoutType.MobilePortrait,
          },
        }}
        getEmbeddedComponent={getEmbeddedComponent}
      />
    </>
  )
}

export default PowerBI
