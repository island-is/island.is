import MarkdownRN from 'react-native-markdown-display'
import { useBrowser } from '../../../lib/use-browser'
import { useTheme } from 'styled-components'

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
}: {
  children: string
  bullets?: boolean
  componentId?: string
}) => {
  const theme = useTheme()
  const { openBrowser } = useBrowser()

  return (
    <MarkdownRN
      onLinkPress={(url) => onLinkPress({ url, componentId, openBrowser })}
      style={{
        body: {
          fontFamily: 'IBM Plex Sans',
          color: theme.color.dark400,
        },
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
