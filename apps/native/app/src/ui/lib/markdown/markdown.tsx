import MarkdownRN from 'react-native-markdown-display'
import { useTheme } from 'styled-components'

export const Markdown = ({
  children,
  bullets,
}: {
  children: string
  bullets?: boolean
}) => {
  const theme = useTheme()

  console.log(children)
  return (
    <MarkdownRN
      style={{
        body: {
          fontFamily: 'IBM Plex Sans',
          color: theme.color.dark400,
        },
        link: {
          color: theme.color.blue400,
          fontWeight: 'bold',
        },
      }}
    >
      {bullets ? `\u2022 ${children}` : children}
    </MarkdownRN>
  )
}
