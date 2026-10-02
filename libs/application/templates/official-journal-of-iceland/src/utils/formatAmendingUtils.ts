/**
 * Ported from: libs/portals/admin/regulations-admin/src/utils/formatAmendingUtils.ts
 *
 * Utility functions for parsing regulation diff HTML and generating
 * Icelandic legal amendment prose.
 */
import isSameDay from 'date-fns/isSameDay'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { asDiv } from '@island.is/regulations'

export const groupElementsByArticleTitleFromDiv = (
  div: HTMLDivElement,
): HTMLElement[][] => {
  const result: HTMLElement[][] = []
  let currentGroup: HTMLElement[] = []

  Array.from(div.children).forEach((child) => {
    const element = child as HTMLElement
    const containsAnyTitle = containsAnyTitleClass(element)
    if (containsAnyTitle) {
      if (currentGroup.length > 0) {
        result.push(currentGroup)
      }
      currentGroup = [element]
    } else {
      currentGroup.push(element)
    }
  })

  if (currentGroup.length > 0) {
    result.push(currentGroup)
  }

  return result
}

const titleArray = ['article__title', 'subchapter__title', 'chapter__title']
export type ArticleTitleType = 'article' | 'chapter' | 'subchapter'

export const containsAnyTitleClass = (element: HTMLElement): boolean => {
  return titleArray.some((title) => element.classList.contains(title))
}

export const getArticleTypeText = (titleType?: ArticleTitleType): string => {
  switch (titleType) {
    case 'chapter':
      return 'nýr kafli'
    case 'subchapter':
      return 'nýr undirkafli'
    default:
      return 'ný grein'
  }
}

export const getArticleTitleType = (element: HTMLElement): ArticleTitleType => {
  if (element.classList.contains('subchapter__title')) {
    return 'subchapter'
  } else if (element.classList.contains('chapter__title')) {
    return 'chapter'
  } else {
    return 'article'
  }
}

/**
 * Extracts article title number (e.g., '1. gr.' or '1. gr. a') from a string,
 * allowing for Icelandic characters.
 */
const extractRegex =
  /^\d+\. gr\.(?: [\p{L}]\.)?(?= |$)|^(?:\d+|[IVXLCDM]+)\.?\s*Kafli(?=\b| |$)/iu

export const extractArticleTitleDisplay = (title: string): string => {
  const grMatch = title.match(extractRegex)
  const articleTitleDisplay = grMatch ? grMatch[0] : title
  return articleTitleDisplay
}

export const hasSubtitle = (title: string): boolean => {
  const grMatch = title.match(extractRegex)
  const articleTitleDisplay = grMatch ? grMatch[0] : title
  const hasSubText = title.trim() !== articleTitleDisplay.trim()
  return hasSubText
}

export const getTextWithSpaces = (element: Node): string => {
  let result = ''

  element.childNodes.forEach((node, index) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += (node.textContent?.trim() || '') + ' '
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      result += getTextWithSpaces(node as HTMLElement)

      if (
        element.childNodes[index + 1] &&
        element.childNodes[index + 1].nodeType !== Node.COMMENT_NODE
      ) {
        result += ' '
      }
    }
  })

  return result.trim()
}

export const removeRegPrefix = (title: string) => {
  if (/^Reglugerð/.test(title)) {
    return title.replace(/^Reglugerð/, '')
  }
  return title
}

// Word boundaries are spelled out with \p{L} because `\b` only knows ASCII
// letters and never matches before "ö" or after "ð".

// "Reglugerð þessi er sett með heimild í …", "Reglugerð þessi, sem sett er
// samkvæmt …", "Reglugerðin er sett skv. …". The basis phrase is required so
// that "sett til innleiðingar …" or "sett með hliðsjón af …" don't match.
const AUTHORITY_RE =
  /(?:^|[^\p{L}])(?:reglugerð(?:in|\s+þessi)|reglur\s+þessar)\s*,?\s+(?:sem\s+)?(?:er\s+|eru\s+)?sett(?:ar)?(?:\s+(?:er|eru))?\s+(með\s+(?:heimild|stoð)|samkvæmt|skv\.|sbr\.|á\s+grundvelli)(?!\p{L})/iu

// Where the authority clause ends: at the entry into force ("…nr. 1/2000 og
// öðlast þegar gildi", "…nr. 50/1988, öðlast gildi …"), or at what the base
// regulation implements ("… og innleiðir …", "… til innleiðingar á …"),
// which doesn't carry over to an amendment.
const AUTHORITY_END_RE =
  /(?:\s*,)?\s+(?:og\s+)?(?:(?:til\s+(?:þess\s+)?að\s+)?öðlast|tekur\s+(?:þegar\s+)?gildi|staðfestist|skal\s+gilda|gildir|innleiðir|til\s+innleiðingar|með\s+hliðsjón\s+af|í\s+samræmi\s+við)(?!\p{L})/iu

// A sentence ends at a period followed by a capitalised word, unless the
// period ends an abbreviation or an ordinal: "sbr. V. kafla", "13. Gr".
const SENTENCE_END_RE = /\.(?=\s+\p{Lu}\p{Ll})/gu
const ABBREVIATIONS = [
  'nr',
  'gr',
  'mgr',
  'málsl',
  'tölul',
  'stafl',
  'sbr',
  'skv',
  'o.fl',
  'þ.e',
  'þ.m.t',
]

/** Whether a period after this text ends an abbreviation or an ordinal. */
export const endsWithAbbreviation = (textBeforePeriod: string): boolean => {
  const word = (textBeforePeriod.match(/(\S+)$/)?.[1] ?? '')
    .replace(/^\(/, '')
    .toLowerCase()
  return ABBREVIATIONS.includes(word) || /^(?:\d+|\p{L})$/u.test(word)
}

const findSentenceEnd = (text: string): number => {
  for (const match of text.matchAll(SENTENCE_END_RE)) {
    const index = match.index ?? 0
    if (!endsWithAbbreviation(text.slice(0, index))) {
      return index
    }
  }
  return text.length
}

/**
 * The authority clause of a gildistaka paragraph, from the basis of the
 * authority up to the entry into force or the end of the sentence. The
 * amending regulation usually rests on the same authority as the regulation
 * it amends, so this is reused in its own gildistaka.
 *
 * @example
 * extractAuthority('Reglugerð þessi er sett með heimild í lögum nr. 1/2000 og öðlast þegar gildi.')
 * // 'með heimild í lögum nr. 1/2000'
 */
export const extractAuthority = (str: string): string | undefined => {
  const text = (str || '').replace(/\s+/g, ' ').trim()
  const match = text.match(AUTHORITY_RE)
  if (!match) {
    return undefined
  }
  const start = (match.index ?? 0) + match[0].length - match[1].length
  let rest = text.slice(start)
  rest = rest.slice(0, findSentenceEnd(rest))
  const end = rest.match(AUTHORITY_END_RE)
  if (end?.index !== undefined) {
    rest = rest.slice(0, end.index)
  }
  rest = rest.replace(/[\s,]+$/, '')
  if (rest.endsWith('.') && !endsWithAbbreviation(rest.slice(0, -1))) {
    rest = rest.slice(0, -1)
  }
  return rest || undefined
}

export const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Whether all dates are the same day. A missing date is its own value. */
export const allSameDay = (objects: Array<{ date?: Date }>): boolean => {
  const [first, ...rest] = objects
  return rest.every((obj) =>
    first.date && obj.date
      ? isSameDay(obj.date, first.date)
      : !first.date && !obj.date,
  )
}

export const hasAnyChange = (diff: string) => {
  const testElement = asDiv(diff)
  const hasDeletion = !!testElement.querySelector('del')
  const hasInsert = !!testElement.querySelector('ins')

  return hasDeletion || hasInsert
}

export const updateAppendixWording = (input: string): string => {
  return input.replace(/fylgiskjal|viðauki/gi, (match) => {
    if (match[0] === match[0].toUpperCase()) {
      if (match.toLowerCase() === 'fylgiskjal') {
        return 'Fylgiskjali'
      } else if (match.toLowerCase() === 'viðauki') {
        return 'Viðauka'
      }
    } else {
      if (match.toLowerCase() === 'fylgiskjal') {
        return 'fylgiskjali'
      } else if (match.toLowerCase() === 'viðauki') {
        return 'viðauka'
      }
    }
    return match
  })
}

export const formatDate = (date: Date) => {
  const newDate = new Date(date)
  if (isNaN(newDate.getTime())) {
    return ''
  }
  const formattedDate = format(newDate, 'dd. MMMM yyyy', {
    locale: is,
  })
  return formattedDate.replace(/^0+/, '')
}
