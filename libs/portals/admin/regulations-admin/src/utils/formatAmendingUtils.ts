import isSameDay from 'date-fns/isSameDay'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { HTMLText, asDiv } from '@island.is/regulations'

export const groupElementsByArticleTitleFromDiv = (
  div: HTMLDivElement,
): HTMLElement[][] => {
  const result: HTMLElement[][] = []
  let currentGroup: HTMLElement[] = []

  Array.from(div.children).forEach((child) => {
    const element = child as HTMLElement
    if (
      element.classList.contains('article__title') ||
      element.classList.contains('chapter__title')
    ) {
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

/**
 * Extracts article title number (e.g., '1. gr.' or '1. gr. a') from a string, allowing for Icelandic characters.
 */
export const extractArticleTitleDisplay = (title: string): string => {
  const grMatch = title.match(/^\d+\. gr\.(?: [\p{L}])?(?= |$)/u)
  const articleTitleDisplay = grMatch ? grMatch[0] : title
  return articleTitleDisplay
}

export const getTextWithSpaces = (element: Node): string => {
  let result = ''

  element.childNodes.forEach((node, index) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += (node.textContent?.trim() || '') + ' '
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      result += getTextWithSpaces(node as HTMLElement)

      // If the current element is not the last node and the next node is also an element or text node,
      // add a space between elements
      if (
        element.childNodes[index + 1] &&
        element.childNodes[index + 1].nodeType !== Node.COMMENT_NODE
      ) {
        result += ' '
      }
    }
  })

  return result.trim() // Trim any excess space
}

export const removeRegPrefix = (title: string) => {
  if (/^Reglugerð/.test(title)) {
    return title.replace(/^Reglugerð/, '')
  }
  return title
}

export const isGildisTaka = (str: string) => {
  return /\b(öðlast|tekur)\b.*\bgildi\b|\bsett\b.*\bmeð\b.*\b(?:heimild|stoð)\b/.test(
    (str || '').toLowerCase(),
  )
}

export type AdditionObject = {
  formattedRegBody: HTMLText[]
  date: Date | undefined
}

export const allSameDay = (objects: AdditionObject[]): boolean => {
  const validObjects = objects.filter((obj) => obj.date !== undefined)

  if (validObjects.length === 0) return true
  const firstDate = validObjects[0].date!

  return validObjects.every((obj) => isSameDay(obj.date!, firstDate))
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
  if (newDate) {
    const formattedDate = format(new Date(date), 'dd. MMMM yyyy', {
      locale: is,
    })
    return formattedDate.replace(/^0+/, '') // Remove leading zeros
  } else {
    return ''
  }
}
