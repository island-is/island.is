import { HTMLText } from '@island.is/regulations-tools/types'

type Params = {
  caseId?: string
  date?: string
  category?: string
  title?: string
  content?: string
  signature?: string
  readonly?: boolean
}

// will be useful later when case is published
const documentHeader = (caseId?: string, date?: string) => {
  if (!caseId && !date) return ''

  return `
    <div class="document-header">
      ${caseId ? `<div class="document-header__case-id">${caseId}</div>` : ''}
      ${date ? `<div class="document-header__date">${date}</div>` : ''}
    </div>
  `
}

const documentTitle = (title?: string, category?: string) => {
  if (!title && !category) return ''

  return `
    <div class="advertisement__title">
    ${
      category ? `<div class="advertisement__title-main">${category}</div>` : ''
    }
      ${title ? `<div class="advertisement__title-sub">${title}</div>` : ''}
    </div>
  `
}

export const advertisementTemplate = ({
  caseId,
  date,
  category,
  title,
  content,
  signature,
  readonly = false,
}: Params) => {
  return `
    <div class="advertisement ${readonly ? 'readonly' : ''}">
      ${documentHeader(caseId, date)}
      ${documentTitle(title, category)}
      <div class="document-content">
        ${content}
      </div>
      <div class="document-signature">
        ${signature}
      </div>
    </div>
  ` as HTMLText
}
