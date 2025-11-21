import { HTMLText } from '@dmr.is/regulations-tools/types'

type Params = {
  advertId?: string
  date?: string
  category?: string
  title?: string
  content?: string
  signature?: string
  readonly?: boolean
}

// will be useful later when advert is published
const documentHeader = (advertId?: string, date?: string) => {
  if (!advertId && !date) return ''

  return `
    <div class="document-header">
      ${
        advertId
          ? `<div class="document-header__case-id">${advertId}</div>`
          : ''
      }
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
  advertId,
  date,
  category,
  title,
  content,
  signature,
  readonly = false,
}: Params) => {
  return `
    <div class="advertisement ${readonly ? 'readonly' : ''}">
      ${documentHeader(advertId, date)}
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
