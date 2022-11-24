import { useEffect, useState } from 'react'
import { PowerBIEmbed } from 'powerbi-client-react'
import { Embed, models } from 'powerbi-client'
import { useApolloClient } from '@apollo/client'
import {
  PowerBiEmbedTokenQuery,
  PowerBiEmbedTokenQueryVariables,
  PowerBiSlice as PowerBiSliceSchema,
} from '@island.is/web/graphql/schema'
import { POWERBI_EMBED_TOKEN_QUERY } from '@island.is/web/screens/queries/PowerBi'

interface PowerBiSliceProps {
  slice: PowerBiSliceSchema
}

export const PowerBiSlice = ({ slice }: PowerBiSliceProps) => {
  const [embedPropsFromServer, setEmbedPropsFromServer] = useState<{
    accessToken: string
    embedUrl: string
    tokenType: models.TokenType
  } | null>(null)
  const [shouldRender, setShouldRender] = useState(false)

  const apolloClient = useApolloClient()

  useEffect(() => {
    const sliceNeedsEmbedParams =
      !!slice.owner && !!slice.reportId && !!slice.workspaceId

    if (!sliceNeedsEmbedParams) {
      setShouldRender(true)
      return
    }

    const getEmbedParams = async () => {
      setShouldRender(false)
      const response = await apolloClient.query<
        PowerBiEmbedTokenQuery,
        PowerBiEmbedTokenQueryVariables
      >({
        query: POWERBI_EMBED_TOKEN_QUERY,
        variables: {
          input: {
            reportId: slice.reportId,
            owner: slice.owner,
            workspaceId: slice.workspaceId,
          },
        },
      })
      if (
        response?.data?.powerbiEmbedToken?.token &&
        response?.data?.powerbiEmbedToken?.embedUrl
      ) {
        setEmbedPropsFromServer({
          accessToken: response.data.powerbiEmbedToken.token,
          embedUrl: response.data.powerbiEmbedToken.embedUrl,
          tokenType: models.TokenType.Embed,
        })
        setShouldRender(true)
      } else {
        // TODO: Show an error
      }
    }

    getEmbedParams()
  }, [apolloClient, slice.owner, slice.reportId, slice.workspaceId])

  const getEmbeddedComponent = (embed: Embed) => {
    // Default styles
    embed.element.style.height = '600px'
    embed.iframe.style.border = 'none'

    // Apply styles to containing element from CMS
    const elementStyle = slice?.powerBiEmbedProps?.style?.element
    if (elementStyle) {
      for (const key of Object.keys(elementStyle)) {
        const value = elementStyle?.[key]
        if (value) {
          embed.element.style[key] = value
        }
      }
    }

    // Apply styles to iframe child emelement from CMS
    const iframeStyle = slice?.powerBiEmbedProps?.style?.iframe
    if (iframeStyle) {
      for (const key of Object.keys(iframeStyle)) {
        const value = iframeStyle?.[key]
        if (value) {
          embed.element.style[key] = value
        }
      }
    }
  }

  if (!shouldRender) return null

  const embedProps = slice?.powerBiEmbedProps?.embedProps ?? {}

  return (
    <PowerBIEmbed
      embedConfig={{
        type: 'report',
        ...embedProps,
        ...embedPropsFromServer,
      }}
      getEmbeddedComponent={getEmbeddedComponent}
    />
  )
}

export default PowerBiSlice
