import { HtmlDocument } from './HTMLDocument'
import { PdfDocWithModal } from './PdfDocument'
import { UrlDocument } from './UrlDocment'
import NoPDF from '../NoPDF/NoPDF'
import { messages } from '../../utils/messages'
import { ActiveDocumentType2 } from '../../lib/types'
import { useLocale } from '@island.is/localization'
import { customUrl } from '../../utils/customUrlHandler'

type DocumentRendererProps = {
  doc: ActiveDocumentType2
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({ doc }) => {
  const { formatMessage } = useLocale()

  if (doc?.document?.type === 'HTML') {
    return <HtmlDocument html={doc.document?.value ?? ''} />
  }

  if (doc?.document?.type === 'PDF') {
    return <PdfDocWithModal document={doc} />
  }

  if (doc?.document?.type === 'URL' || doc.downloadUrl) {
    const docUrl = customUrl({
      ...doc,
      document: {
        content: doc.document.value ?? '',
        html: doc.document.value ?? '',
        url: doc.document.value ?? '',
        fileType: doc.document.type ?? '',
      },
    })

    return <UrlDocument url={docUrl} />
  }

  return <NoPDF text={formatMessage(messages.error)} />
}
