import { HTMLText } from '@island.is/regulations-tools/types'

type Params = {
  caseId?: string
  date?: string
  department?: string
  title?: string
  content?: string
  signature?: string
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

const documentTitle = (title?: string, department?: string) => {
  if (!title && !department) return ''

  return `
    <div class="advertisement__title">
    ${
      department
        ? `<div class="advertisement__title-main">${department}</div>`
        : ''
    }
      ${title ? `<div class="advertisement__title-sub">${title}</div>` : ''}
    </div>
  `
}

export const advertisementTemplate = ({
  caseId,
  date,
  department,
  title,
  content,
  signature,
}: Params) => {
  return `
    <div class="advertisement">
      ${documentHeader(caseId, date)}
      ${documentTitle(title, department)}
      <div class="document-content">
        ${content}
      </div>
      <div class="document-signature">
        ${signature}
      </div>
    </div>
  ` as HTMLText
}
