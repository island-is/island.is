import { DocumentDetails } from '@island.is/api/schema'
import { HtmlDocument } from './HTMLDocument'
import { PdfDocument } from './PdfDocument'
import { UrlDocument } from './UrlDocment'
import NoPDF from '../NoPDF/NoPDF'
import { messages } from '../../utils/messages'
import { ActiveDocumentType } from '../../lib/types'
import { useLocale } from '@island.is/localization'

const parseDocmentType = (doc: DocumentDetails) => {
  if (doc.html && doc.html.length > 0) {
    return 'html'
  }
  if (doc.content && doc.content.length > 0) {
    return 'pdf'
  }
  if (doc.url && doc.url.length > 0) {
    return 'url'
  }
  return 'unknown'
}

type DocumentRendererProps = {
  document: ActiveDocumentType
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  document,
}) => {
  const { formatMessage } = useLocale()
  const type = parseDocmentType(document.document)

  if (type === 'unknown') return <NoPDF text={formatMessage(messages.error)} />

  if (type === 'html') {
    return <HtmlDocument html={document.document.html} />
  }

  if (type === 'pdf') {
    return <PdfDocument document={document} />
  }

  if (type === 'url') {
    return <UrlDocument url={document.document.url} />
  }

  return <NoPDF />
}
