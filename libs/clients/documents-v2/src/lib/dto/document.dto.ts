import { DocumentDTO } from '../..'

export type FileType = 'pdf' | 'html' | 'url'

export type DocumentDto = {
  fileName?: string
  fileType: FileType
  content: string
  date: Date
  bookmarked?: boolean
  archived?: boolean
  senderName?: string
  senderNationalId: string
  subject: string
  categoryId?: string
}

export const mapToDocument = (document: DocumentDTO): DocumentDto | null => {
  if (
    !document.publicationDate ||
    !document.senderKennitala ||
    !document.subject
  ) {
    return null
  }

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
    subject: document.subject,
    categoryId: document.categoryId?.toString(),
  }
}
