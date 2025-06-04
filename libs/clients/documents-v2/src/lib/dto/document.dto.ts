import { DocumentDTO, MessageAction } from '../..'
import sanitizeHtml from 'sanitize-html'
import { svgAttr, svgTags } from '../../utils/htmlConfig'

const customDocument = {
  senderName: 'Ríkisskattstjóri',
  senderNatReg: '5402696029',
  subjectContains: 'Niðurstaða álagningar',
  url: 'https://thjonustusidur.rsk.is/alagningarsedill',
}

export type FileType = 'pdf' | 'html' | 'url'

export type DocumentDto = {
  fileName?: string
  fileType: FileType
  content?: string | null
  date?: Date
  bookmarked?: boolean
  archived?: boolean
  senderName?: string
  senderNationalId?: string
  subject: string
  categoryId?: string
  urgent?: boolean
  actions?: Array<MessageAction>
}

export const mapToDocument = (
  document: DocumentDTO,
  includeDocument?: boolean,
): DocumentDto | null => {
  let fileType: FileType, content: string
  const returnData = {
    fileName: document.fileName,
    date: document.publicationDate,
    bookmarked: document.bookmarked,
    archived: document.archived,
    senderName: document.senderName,
    senderNationalId: document.senderKennitala,
    subject: document.subject ?? 'Óþekktur titill', // All of the content in this service is strictly Icelandic. Fallback to match.
    categoryId: document.categoryId?.toString(),
    urgent: document.urgent,
    actions: document.actions,
  }
  if (document.content) {
    fileType = 'pdf'
    content = document.content
  } else if (document.url) {
    fileType = 'url'

    // // Handling edge case for documents that can't be presented due to requiring authentication through rsk.is
    // if (
    //   document.senderKennitala === customDocument.senderNatReg &&
    //   document?.subject?.includes(customDocument.subjectContains)
    // ) {
    //   content = customDocument.url
    // } else {
    //   content = document.url
    // }

    // This is just a test - may be reverted or cleaned up before prod
    content = document.url
  } else if (document.htmlContent) {
    fileType = 'html'

    const html = sanitizeHtml(document.htmlContent, {
      parser: {
        lowerCaseAttributeNames: false,
      },
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'img',
        ...svgTags,
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['style'],
        ...svgAttr,
      },
      allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat([
        'data',
        'https',
      ]),
    })
    content = html
  } else if (!includeDocument) {
    return { ...returnData, content: null, fileType: 'pdf' }
  } else {
    return null
  }
  return {
    ...returnData,
    content,
    fileType,
  }
}
