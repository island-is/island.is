import { Box } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import * as styles from './TextMarkdown.css'

interface Props {
  children: string
  openLinksInNewTab?: boolean
}

export const TextMarkdown = ({
  children,
  openLinksInNewTab = false,
}: Props) => (
  <Box className={styles.container}>
    <Markdown options={{ openLinksInNewTab }}>{children}</Markdown>
  </Box>
)

export default TextMarkdown
