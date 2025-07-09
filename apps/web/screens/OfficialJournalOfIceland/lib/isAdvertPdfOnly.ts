import { MessageDescriptor } from 'react-intl'

import { m } from '../messages'

export const isSingleParagraph = (htmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const bodyChildren = Array.from(doc.body.children)

  return (
    bodyChildren.length === 1 && bodyChildren[0].tagName.toLowerCase() === 'p'
  )
}

export const isAdvertPdfOnly = (
  htmlString: string,
  date?: string,
): MessageDescriptor => {
  const isHtmlEmpty = !htmlString || htmlString.trim() === ''
  const isSinglePara = isSingleParagraph(htmlString)

  const isMainTextEmpty = isHtmlEmpty || isSinglePara

  if (isMainTextEmpty) {
    const lawChangedDate = new Date('2005-03-22') // 22. mars 2005
    const isDateBeforeLawChange = date && new Date(date) < lawChangedDate

    return isDateBeforeLawChange
      ? m.advert.descriptionEmpty
      : m.advert.descriptionPdfOnly
  }

  return m.advert.description
}
