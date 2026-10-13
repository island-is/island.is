import MarkdownRN from 'react-native-markdown-display'
import { TextStyle } from 'react-native'
import { useBrowser } from '../../../hooks/use-browser'
import { useTheme } from 'styled-components'
import { fontByWeight } from '../../utils'

const onLinkPress = ({
  url,
  openBrowser,
  componentId,
}: {
  url: string
  openBrowser: (link: string, componentId?: string) => void
  componentId?: string
}) => {
  if (url) {
    openBrowser(url, componentId)
    return false
  }
  // use default behavior for internal links
  return true
}

export const Markdown = ({
  children,
  bullets,
  componentId,
  fontSize,
  lineHeight,
  fontWeight,
  color,
  // Paragraphs carry a 10px vertical margin by default; pass false where the
  // markdown has to sit flush with the surrounding layout.
  paragraphSpacing = true,
  // Overrides the default "open in browser" handling, e.g. to route links that
  // map to a native screen.
  onPressLink,
}: {
  children: string
  bullets?: boolean
  componentId?: string
  fontSize?: number
  lineHeight?: number
  fontWeight?: TextStyle['fontWeight']
  color?: string
  paragraphSpacing?: boolean
  onPressLink?: (url: string) => void
}) => {
  const theme = useTheme()
  const { openBrowser } = useBrowser()

  return (
    <MarkdownRN
      onLinkPress={(url) => {
        if (onPressLink) {
          onPressLink(url)
          return false
        }
        return onLinkPress({ url, componentId, openBrowser })
      }}
      style={{
        body: {
          // Weights map to font families in this app, so a bare fontWeight
          // would not change the rendered face.
          fontFamily: fontWeight ? fontByWeight(fontWeight) : 'IBM Plex Sans',
          color: color ?? theme.color.dark400,
          ...(fontSize != null && { fontSize }),
          ...(lineHeight != null && { lineHeight }),
          ...(fontWeight != null && { fontWeight }),
        },
        ...(!paragraphSpacing && {
          paragraph: { marginTop: 0, marginBottom: 0 },
        }),
        link: {
          color: theme.color.blue400,
          fontWeight: '600',
        },
      }}
    >
      {bullets ? `\u2022  ${children}` : children}
    </MarkdownRN>
  )
}
