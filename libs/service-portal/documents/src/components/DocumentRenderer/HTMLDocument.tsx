import { Box } from '@island.is/island-ui/core'

type HtmlDocumentProps = {
  html: string
}
export const HtmlDocument: React.FC<HtmlDocumentProps> = ({ html }) => {
  return <Box dangerouslySetInnerHTML={{ __html: html }} />
}
