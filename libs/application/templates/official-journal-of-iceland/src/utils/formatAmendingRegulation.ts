/**
 * Ported from: libs/portals/admin/regulations-admin/src/utils/formatAmendingRegulation.ts
 *
 * Adapted to work with RegulationImpactSchema (OJOI application template)
 * instead of regulations-admin DraftImpactForm types.
 *
 * Generates the Icelandic legal prose body text for amending regulations
 * from the diff HTML computed during impact editing.
 */
import { asDiv, HTMLText } from '@island.is/regulations'
import { RegulationImpactSchema } from '../lib/dataSchema'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import {
  allSameDay,
  containsAnyTitleClass,
  extractArticleTitleDisplay,
  formatDate,
  getArticleTitleType,
  getArticleTypeText,
  getTextWithSpaces,
  groupElementsByArticleTitleFromDiv,
  hasAnyChange,
  hasSubtitle,
  isGildisTaka,
  removeRegPrefix,
  updateAppendixWording,
} from './formatAmendingUtils'
import { getDeletionOrAddition } from './getDeletionOrAddition'

// ----------------------------------------------------------------------
const PREFIX = 'Reglugerð um '
const PREFIX_AMENDING = 'breytingu á reglugerð '
const PREFIX_REPEALING = 'brottfellingu reglugerðar nr. '

const formatAffectedAndPlaceAffectedAtEnd = (
  groups: {
    formattedRegBody: HTMLText[]
    date?: Date | undefined
  }[],
  hideAffected?: boolean,
) => {
  const formatArray = (arr: string[]): string => {
    if (arr.length === 1) {
      return arr[0]
    } else if (arr.length === 2) {
      return arr.join(' og ')
    } else if (arr.length > 2) {
      const lastItem = arr.pop()
      const joinedItems = arr.join(', ')
      const cleanString = `${joinedItems} og ${lastItem}`.replace(
        / +(?= )/g,
        '',
      )
      return cleanString
    }
    return ''
  }

  const extractArticleNumber = (str: string): number | null => {
    const match = str.match(/(\d+)\. gr/)
    return match ? parseInt(match[1], 10) : null
  }

  let articleNumber = 0
  const gildsTakaKeepArray: HTMLText[] = []
  const articleKeepArray: { text: HTMLText; originalIndex: number }[] = []
  const impactAffectArray: HTMLText[] = []

  groups.forEach((item) => {
    const affectedImpacts: HTMLText[] = []
    item.formattedRegBody.forEach((body) => {
      if (isGildisTaka(body)) {
        gildsTakaKeepArray.push(body)
      } else {
        articleKeepArray.push({ text: body, originalIndex: articleNumber })
        affectedImpacts.push(`${articleNumber + 1}. gr.` as HTMLText)
        articleNumber++
      }
    })
    const impactString = formatArray(affectedImpacts)
    const impactAffectedString = `Ákvæði ${impactString} reglugerðarinnar ${
      item.date ? 'öðlast gildi ' + formatDate(item.date) : 'öðlast þegar gildi'
    }`
    impactAffectArray.push(impactAffectedString as HTMLText)
  })

  articleKeepArray.sort((a, b) => {
    const numA = extractArticleNumber(a.text as string)
    const numB = extractArticleNumber(b.text as string)
    return (numA || 0) - (numB || 0)
  })

  const updatedImpactAffectArray = impactAffectArray.map((impact) => {
    const match = impact.match(/(\d+)\. gr\./g)
    if (match) {
      match.forEach((m) => {
        const oldNumber = parseInt((m.match(/(\d+)/) || ['0', '0'])[1], 10)
        const newNumber =
          articleKeepArray.findIndex(
            (item) => item.originalIndex === oldNumber - 1,
          ) + 1
        impact = impact.replace(m, `${newNumber}. gr.`) as HTMLText
      })
    }
    return impact as HTMLText
  })

  const uniqueGildistaka = uniq(gildsTakaKeepArray)
  let joinedAffected = updatedImpactAffectArray.join('. ')
  if (hideAffected) {
    joinedAffected = ''
  }
  const gildistakaReturn = flatten([...uniqueGildistaka, joinedAffected]).join(
    '',
  ) as HTMLText

  return [...articleKeepArray.map((item) => item.text), gildistakaReturn]
}

const removeRegNamePrefix = (name: string) => {
  if (/^0+/.test(name)) {
    return name.replace(/^0+/, '')
  }
  return name
}

// ----------------------------------------------------------------------

/**
 * Generate an amending regulation title from all impacts.
 *
 * @param skipRegulationPrefix - When true, omits the leading "Reglugerð "
 *   so the title starts with "um breytingu á ...". Used in the OJOI
 *   application flow.
 *
 * @example "Reglugerð um breytingu á reglugerð nr. 123/2020 um ..."
 * @example (skipRegulationPrefix) "um breytingu á reglugerð nr. 123/2020 um ..."
 */
export const formatAmendingRegTitle = (
  impacts: RegulationImpactSchema[],
  options?: { skipRegulationPrefix?: boolean },
) => {
  const { skipRegulationPrefix = false } = options ?? {}
  const prefix = skipRegulationPrefix ? 'um ' : PREFIX

  if (impacts.length === 0) return prefix

  const amendingArray = impacts.filter((item) => item.type === 'amend')
  const repealArray = impacts.filter((item) => item.type === 'repeal')

  const amendingTitles = uniq(
    amendingArray.map((item) => {
      const title = removeRegPrefix(item.regTitle || '').trim()
      const name = removeRegNamePrefix(item.name)
      return title ? `${title}, nr. ${name}` : `nr. ${name}`
    }),
  )

  const prefixedAmendingTitles = amendingTitles.map(
    (title, i) => `${i === 0 ? `${PREFIX_AMENDING}` : ''}${title}`,
  )

  const repealTitles = repealArray.map(
    (item, i) =>
      `${i === 0 ? `${PREFIX_REPEALING}` : ''}${removeRegNamePrefix(
        item.name,
      )} ${removeRegPrefix(item.regTitle || '')}`,
  )

  return (
    prefix +
    [...prefixedAmendingTitles, ...repealTitles]
      .join(' og ')
      .replace(/ +(?= )/g, '')
  )
}

// ----------------------------------------------------------------------

/**
 * Generate the legal prose body text for a single impact from its diff HTML.
 */
export const formatAmendingRegBody = (
  name: string,
  repeal?: boolean,
  diff?: string,
  regTitle?: string,
  appendixes?: Array<{
    title?: string
    text?: string
    diff?: string
    revoked?: boolean
  }>,
) => {
  const regName = removeRegNamePrefix(name)
  if (repeal) {
    const title = regTitle ? regTitle.replace(/^reglugerð\s*/i, '').trim() : ''
    const text = `<p>Reglugerð nr. ${regName} ${title.replace(
      /\.$/,
      '',
    )} fellur brott.</p>` as HTMLText
    const gildistaka =
      `<p>Reglugerð þessi er sett með heimild í [].</p><p>Reglugerðin öðlast þegar gildi.</p>` as HTMLText
    return [text, gildistaka]
  }

  if (!diff) {
    return []
  }

  const additionArray: HTMLText[][] = []

  const diffString = diff as string
  const diffDiv = asDiv(diffString)

  let paragraph = 0
  const groupedArticles = groupElementsByArticleTitleFromDiv(diffDiv)

  const regNameDisplay =
    regName && regName !== 'self'
      ? `reglugerðar nr. ${regName}`.replace(/\.$/, '')
      : 'reglugerðarinnar'

  groupedArticles.forEach((group, i) => {
    let articleTitle = ''
    const testGroup: {
      arr: HTMLText[]
      original?: HTMLText[]
      titleObject: {
        text: string
        hasSubtitle: boolean
        type: 'article' | 'chapter' | 'subchapter'
      }
      isDeletion?: boolean
      isAddition?: boolean
    } = {
      arr: [],
      original: [],
      titleObject: {
        text: '',
        hasSubtitle: false,
        type: 'article',
      },
      isDeletion: undefined,
      isAddition: undefined,
    }

    group.forEach((element) => {
      let pushHtml = '' as HTMLText

      let isParagraph = false
      let isSectionTitle = false
      let isNumberList = false
      let isLetterList = false
      const containsAnyTitle = containsAnyTitleClass(element)
      if (containsAnyTitle) {
        const clone = element.cloneNode(true)

        const textContent = getTextWithSpaces(clone)
        articleTitle = extractArticleTitleDisplay(textContent)
        testGroup.titleObject.hasSubtitle = hasSubtitle(textContent)
        testGroup.titleObject.type = getArticleTitleType(element)
        testGroup.titleObject.text = articleTitle
        isSectionTitle = true
        paragraph = 0
      } else if (element.nodeName.toLowerCase() === 'p') {
        paragraph++
        isParagraph = true
      } else if (element.nodeName.toLowerCase() === 'ol') {
        if (element.getAttribute('type')?.toLowerCase() === 'a') {
          isLetterList = true
        } else {
          isNumberList = true
        }
      }

      const hasDeletion = !!element.querySelector('del')
      const hasInsert = !!element.querySelector('ins')

      const isGildistokuGrein =
        isParagraph && isGildisTaka(element.textContent || '')

      const elementType =
        isLetterList || isNumberList
          ? 'lidur'
          : isSectionTitle
          ? 'greinTitle'
          : undefined

      const {
        newText,
        oldText,
        isDeleted,
        isAddition,
        liHtml,
        newTextElement,
      } = getDeletionOrAddition(element, elementType)

      if (hasDeletion || hasInsert || isGildistokuGrein) {
        if (isGildistokuGrein) {
          pushHtml = `<p>${oldText}</p>` as HTMLText
        } else if (isDeleted) {
          testGroup.isAddition = false
          if (testGroup.isDeletion !== false) {
            testGroup.isDeletion = true
          }
          if (isParagraph) {
            pushHtml =
              `<p>${paragraph}. mgr. ${articleTitle} ${regNameDisplay} fellur brott.</p>` as HTMLText
          } else if (isSectionTitle) {
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} fellur brott.</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            pushHtml = `<p>${
              isLetterList ? 'Stafliðir' : 'Töluliðir'
            } eftir ${paragraph}. mgr. ${articleTitle} ${regNameDisplay} falla brott.</p>` as HTMLText
          } else {
            pushHtml =
              `<p>Texti í ${articleTitle} ${regNameDisplay} fellur brott:</p><p>${oldText}</p>` as HTMLText
          }
        } else if (isAddition) {
          testGroup.isDeletion = false
          if (testGroup.isAddition !== false) {
            testGroup.isAddition = true
          }
          if (isParagraph) {
            testGroup.original?.push(`<p>${newText}</p>` as HTMLText)
            pushHtml =
              paragraph > 1
                ? (`<p>Á eftir ${
                    paragraph - 1
                  }. mgr. ${articleTitle} ${regNameDisplay} kemur ný málsgrein sem orðast svo:</p><p>${newText}</p>` as HTMLText)
                : (`<p>Á undan 1. mgr. ${articleTitle} ${regNameDisplay} kemur ný málsgrein svohljóðandi: </p><p>${newText}</p>` as HTMLText)
          } else if (isSectionTitle) {
            testGroup.original?.push(`<p>${newText}</p>` as HTMLText)
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            const liCleanArray: (string | null)[] = []
            newTextElement.querySelectorAll('ins').forEach((e) => {
              if (e.textContent) liCleanArray.push(e.textContent)
            })

            const newLiTextBody =
              liCleanArray.length > 0
                ? `<ol><li>${liCleanArray.join('</li><li>')}</li><ol>`
                : `<p>${newText}</p>`

            testGroup.original?.push(newLiTextBody as HTMLText)
            pushHtml = `<p>${
              isLetterList ? 'Stafliðum' : 'Töluliðum'
            } eftir ${paragraph}. mgr. ${articleTitle} ${regNameDisplay} er bætt við:</p>${newLiTextBody}` as HTMLText
          } else {
            testGroup.original?.push(`<p>${newText}</p>` as HTMLText)
            pushHtml =
              `<p>Eftirfarandi texta ${regNameDisplay} var bætt við:</p><p>${newText}</p>` as HTMLText
          }
        } else {
          // Change detected. Not addition, not deletion.
          testGroup.isDeletion = false
          testGroup.isAddition = false
          if (isSectionTitle) {
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} breytist og orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isParagraph) {
            pushHtml =
              `<p>${paragraph}. mgr. ${articleTitle} ${regNameDisplay} breytist og orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            pushHtml =
              `<p>Eftirfarandi breytingar verða á ${paragraph}. mgr. ${articleTitle} ${regNameDisplay}:</p> ${liHtml}` as HTMLText
          } else {
            pushHtml =
              `<p>Eftirfarandi breytingar ${regNameDisplay} áttu sér stað:</p><p>${
                oldText ? `Í stað ${oldText} kemur ` : ''
              }${newText}</p>` as HTMLText
          }
        }
        testGroup.arr.push(pushHtml)
      } else {
        testGroup.isDeletion = false
        testGroup.isAddition = false
      }
    })
    if (testGroup.isDeletion === true) {
      const articleTitleNumber = testGroup.titleObject.text

      additionArray.push([
        `<p>${articleTitleNumber} ${regNameDisplay} fellur brott.</p>` as HTMLText,
      ])
    } else if (testGroup.isAddition === true) {
      let prevArticleTitle = ''
      const prevArticle = groupedArticles?.[i - 1]
      if (prevArticle && prevArticle.length > 0) {
        prevArticleTitle = prevArticle[0]?.innerText
      }
      const articleTitleNumber = testGroup.titleObject.text
      const originalTextArray = testGroup.original?.length
        ? flatten(testGroup.original)
        : []

      const prevArticleTitleNumber =
        extractArticleTitleDisplay(prevArticleTitle)

      let articleDisplayText = ''

      if (originalTextArray.length > 1) {
        const [, ...rest] = originalTextArray
        articleDisplayText = rest.join('')
      } else {
        articleDisplayText = testGroup.original
          ? testGroup.original?.join('')
          : ''
      }

      const articleTypeText = getArticleTypeText(testGroup.titleObject.type)
      additionArray.push([
        `<p>Á eftir ${prevArticleTitleNumber} ${regNameDisplay} kemur ${articleTypeText}, ${
          articleTitleNumber ? articleTitleNumber + ',' : ''
        }${
          testGroup.titleObject.hasSubtitle ? ' ásamt fyrirsögn,' : ''
        } svohljóðandi:</p> ${articleDisplayText}` as HTMLText,
      ])
    } else {
      additionArray.push(testGroup.arr)
    }
  })

  appendixes?.forEach((apx, idx) => {
    if (apx.diff) {
      const defaultTitle = apx.title ?? `Viðauki ${idx + 1}`

      const regNameAddition =
        regName && regName !== 'self'
          ? `reglugerð nr. ${regName}`.replace(/\.$/, '')
          : 'reglugerðina'
      const regNameChange =
        regName && regName !== 'self'
          ? `, reglugerðar nr. ${regName}`.replace(/\.$/, '')
          : ''

      const testAddTitle = `Við ${regNameAddition} bætist nýr viðauki, ${defaultTitle} sem ${
        /fylgiskjal/i.test(defaultTitle) ? 'birt' : 'birtur'
      } er með reglugerð þessari.`
      const testChangeTitle = `Eftirfarandi breytingar eru gerðar á ${updateAppendixWording(
        defaultTitle,
      )}${regNameChange}:`

      if (apx.diff.includes('<div data-diff="new">')) {
        additionArray.push([`<p>${testAddTitle}</p>` as HTMLText])
      } else if (hasAnyChange(apx.diff)) {
        additionArray.push([`<p>${testChangeTitle}</p><p>[]</p>` as HTMLText])
      }
    }
  })

  return additionArray.flat()
}

// ----------------------------------------------------------------------

/**
 * Group impacts by regulation name (target regulation).
 */
const groupImpactsByName = (
  impacts: RegulationImpactSchema[],
): Record<string, RegulationImpactSchema[]> => {
  const grouped: Record<string, RegulationImpactSchema[]> = {}
  for (const impact of impacts) {
    const key = impact.name
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(impact)
  }
  return grouped
}

/**
 * Generate the full amending regulation body text from all impacts.
 *
 * Each impact's diff HTML is parsed to produce human-readable Icelandic
 * legal prose (e.g., "1. mgr. 5. gr. reglugerðar nr. 123/2020 breytist og
 * orðast svo:…"). The results are numbered as articles (1. gr., 2. gr., …).
 */
export const formatAmendingBodyWithArticlePrefix = (
  impacts: RegulationImpactSchema[],
): HTMLText[] => {
  const grouped = groupImpactsByName(impacts)
  const draftImpactLength = Object.keys(grouped).length

  const impactAdditionArray = Object.entries(grouped).map(([, impactArr]) => {
    const items = impactArr.map((item) => ({
      formattedRegBody: formatAmendingRegBody(
        item.type === 'repeal' || draftImpactLength > 1 ? item.name : '',
        item.type === 'repeal',
        item.type === 'amend' ? item.diff : undefined,
        item.regTitle,
        item.type === 'amend' ? item.appendixes : undefined,
      ),
      date: item.date ? new Date(item.date) : undefined,
    }))
    return flatten(items)
  })

  const additions = flatten(impactAdditionArray)

  const hideAffected = allSameDay(additions)
  const htmlForEditor = formatAffectedAndPlaceAffectedAtEnd(
    additions,
    hideAffected,
  )

  const returnArray = compact(htmlForEditor)

  const prependString = returnArray.map(
    (item, i) =>
      `<h3 class="article__title">${i + 1}. gr.</h3>${item}` as HTMLText,
  )

  return prependString
}
