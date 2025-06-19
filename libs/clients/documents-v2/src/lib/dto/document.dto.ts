import { DocumentDTO, MessageAction, TicketDto } from '../..'
import sanitizeHtml from 'sanitize-html'
import { svgAttr, svgTags } from '../../utils/htmlConfig'

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
  replyable?: boolean | null
  ticket?: TicketDto | null
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
    replyable: document.replyable,
    ticket: document.ticket,
  }
  if (document.content) {
    fileType = 'pdf'
    content = document.content
  } else if (document.url) {
    fileType = 'url'
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
