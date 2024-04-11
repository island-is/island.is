import { HtmlDocument } from './HTMLDocument'
import { PdfDocWithModal } from './PdfDocument'
import { UrlDocument } from './UrlDocment'
import NoPDF from '../NoPDF/NoPDF'
import { messages } from '../../utils/messages'
import { ActiveDocumentType2 } from '../../lib/types'
import { useLocale } from '@island.is/localization'
import { customUrl } from '../../utils/customUrlHandler'

const parseDocmentType = (document: ActiveDocumentType2) => {
  const doc = document.document
  const overviewUrl = document.downloadUrl

  if (doc?.type === 'HTML') {
    return 'html'
  }
  if (doc?.type === 'PDF') {
    return 'pdf'
  }
  if (doc?.type === 'URL' || overviewUrl) {
    return 'url'
  }
  return 'unknown'
}

type DocumentRendererProps = {
  document: ActiveDocumentType2
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  document,
}) => {
  const { formatMessage } = useLocale()
  const type = parseDocmentType(document)

  if (type === 'unknown') return <NoPDF text={formatMessage(messages.error)} />

  if (type === 'html') {
    return <HtmlDocument html={document.document?.value ?? ''} />
  }

  if (type === 'pdf') {
    return (
      <PdfDocWithModal
        document={{
          ...document,
          document: {
            content: document.document.value ?? '',
            html: document.document.value ?? '',
            url: document.document.value ?? '',
            fileType: document.document.type ?? '',
          },
        }}
      />
    )
  }

  if (type === 'url') {
    const docUrl = customUrl({
      ...document,
      document: {
        content: document.document.value ?? '',
        html: document.document.value ?? '',
        url: document.document.value ?? '',
        fileType: document.document.type ?? '',
      },
    })

    return <UrlDocument url={docUrl} />
  }

  return <NoPDF />
}
