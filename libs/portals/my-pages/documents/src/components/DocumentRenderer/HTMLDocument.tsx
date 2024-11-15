import { Box } from '@island.is/island-ui/core'
import * as styles from './DocumentRenderer.css'

type HtmlDocumentProps = {
  html: string
}
export const HtmlDocument: React.FC<HtmlDocumentProps> = ({ html }) => {
  return (
    <Box
      className={styles.htmlDoc}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
