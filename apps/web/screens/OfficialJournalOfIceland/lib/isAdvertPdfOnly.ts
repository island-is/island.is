import { MessageDescriptor } from 'react-intl'

import { m } from '../messages'

export const isSingleParagraph = (htmlString: string): boolean => {
  if (!htmlString) return false

  const trimmed = htmlString.trim()

  const match = trimmed.match(/^<p[^>]*>[\s\S]*<\/p>$/i)

  if (!match) return false

  const innerContent = trimmed.replace(/^<p[^>]*>|<\/p>$/gi, '').trim()

  const blockTagPattern =
    /<(div|section|article|table|ul|ol|h\d|blockquote|p)[\s>]/i
  return !blockTagPattern.test(innerContent)
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
