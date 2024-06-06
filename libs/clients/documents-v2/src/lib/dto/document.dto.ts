import { DocumentDTO, MessageAction } from '../..'

export type FileType = 'pdf' | 'html' | 'url'

export type DocumentDto = {
  fileName?: string
  fileType: FileType
  content: string
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

export const mapToDocument = (document: DocumentDTO): DocumentDto | null => {
  let fileType: FileType, content: string
  switch (document.fileType) {
    case 'pdf':
      if (!document.content) {
        return null
      }
      fileType = 'pdf'
      content = document.content
      break
    case 'html':
      if (!document.htmlContent) {
        return null
      }
      fileType = 'html'
      content = document.htmlContent
      break
    case 'url':
      if (!document.url) {
        return null
      }
      fileType = 'url'
      content = document.url
      break
    default:
      // Some document providers can not explicitly set the fileType so we have to guess the fileType by checking for the content, in case the fileType is not set.
      if (document.htmlContent) {
        fileType = 'html'
        content = document.htmlContent
        break
      }
      if (document.url) {
        fileType = 'url'
        content = document.url
        break
      }
      return null
  }

  return {
    fileName: document.fileName,
    fileType: fileType,
    content: content,
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
}
