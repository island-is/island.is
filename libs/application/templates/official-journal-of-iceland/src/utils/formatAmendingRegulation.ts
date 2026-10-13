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
  endsWithAbbreviation,
  escapeHtml,
  extractArticleTitleDisplay,
  extractAuthority,
  formatDate,
  getArticleTitleType,
  getArticleTypeText,
  getTextWithSpaces,
  groupElementsByArticleTitleFromDiv,
  hasAnyChange,
  hasSubtitle,
  removeRegPrefix,
  updateAppendixWording,
} from './formatAmendingUtils'
import { getDeletionOrAddition } from './getDeletionOrAddition'

// ----------------------------------------------------------------------
const PREFIX = 'Reglugerð um '
const PREFIX_AMENDING = 'breytingu á reglugerð '
const PREFIX_REPEALING = 'brottfellingu reglugerðar '

type ImpactBody = {
  /** Amendment text, one entry per article of the amending regulation. */
  articles: HTMLText[]
  /** Appendix changes, which follow the article changes. */
  appendixes: HTMLText[]
  /** Authority clauses from the amended regulation's gildistaka. */
  authorities: string[]
}

type ImpactGroup = ImpactBody & {
  /** Position of the target regulation, keeps its changes together. */
  regIndex: number
  date?: Date
}

const joinWithOg = (arr: string[]): string =>
  arr.length < 2
    ? arr.join('')
    : `${arr.slice(0, -1).join(', ')} og ${arr[arr.length - 1]}`

const extractArticleNumber = (str: string): number | undefined => {
  const match = str.match(/(\d+)\. gr/)
  return match ? parseInt(match[1], 10) : undefined
}

const formatAffectedAndPlaceAffectedAtEnd = (
  groups: ImpactGroup[],
): HTMLText[] => {
  const articles = groups
    .flatMap((group, groupIndex) => {
      // Text without an article, like a chapter heading, stays after the
      // article before it.
      let articleNumber = 0
      return [
        ...group.articles.map((text) => {
          articleNumber = extractArticleNumber(text) ?? articleNumber
          return { text, groupIndex, regIndex: group.regIndex, articleNumber }
        }),
        ...group.appendixes.map((text) => ({
          text,
          groupIndex,
          regIndex: group.regIndex,
          articleNumber: Number.MAX_SAFE_INTEGER,
        })),
      ]
    })
    .sort(
      (a, b) => a.regIndex - b.regIndex || a.articleNumber - b.articleNumber,
    )

  if (articles.length === 0) {
    return []
  }

  // One entry-into-force date for the whole regulation when every change
  // takes effect on the same day, or none of them has a date.
  const datedGroups = groups.filter(
    (group) => group.articles.length > 0 || group.appendixes.length > 0,
  )
  const hideAffected = allSameDay(datedGroups)

  const affected = hideAffected
    ? []
    : groups.flatMap((group, groupIndex) => {
        const articleNumbers = articles.flatMap((item, i) =>
          item.groupIndex === groupIndex ? [`${i + 1}. gr.`] : [],
        )
        if (articleNumbers.length === 0) {
          return []
        }
        return [
          `<p>Ákvæði ${joinWithOg(articleNumbers)} reglugerðarinnar ${
            group.date
              ? 'öðlast gildi ' + formatDate(group.date)
              : 'öðlast þegar gildi'
          }.</p>`,
        ]
      })

  // The amending regulation's own gildistaka, reusing the authority of the
  // regulations it amends. "[]" marks it for the editor to fill in.
  const authorities = uniq(groups.flatMap((group) => group.authorities))
  const authority =
    authorities.length > 0 ? joinWithOg(authorities) : 'með heimild í []'
  const date = datedGroups.find((group) => group.date)?.date
  const gildistaka = hideAffected
    ? `<p>Reglugerð þessi er sett ${authority} og öðlast ${
        date ? 'gildi ' + formatDate(date) : 'þegar gildi'
      }.</p>`
    : `<p>Reglugerð þessi er sett ${authority}${
        authority.endsWith('.') ? '' : '.'
      }</p>`

  return [
    ...articles.map((item) => item.text),
    [gildistaka, ...affected].join('') as HTMLText,
  ]
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
 * @example "Reglugerð um breytingu á reglugerð um …, nr. 123/2020."
 * @example (skipRegulationPrefix) "um breytingu á reglugerð um …, nr. 123/2020."
 */
export const formatAmendingRegTitle = (
  impacts: RegulationImpactSchema[],
  options?: { skipRegulationPrefix?: boolean },
) => {
  const { skipRegulationPrefix = false } = options ?? {}
  const prefix = skipRegulationPrefix ? 'um ' : PREFIX

  if (impacts.length === 0) return prefix

  // 'self' impacts target the regulation being written, not one to name here.
  const targets = impacts.filter((item) => item.name !== 'self')
  const amendingArray = targets.filter((item) => item.type === 'amend')
  const repealArray = targets.filter((item) => item.type === 'repeal')

  // "Reglugerð um A." -> "um A", but keep the period of "… o.fl."
  const titleOf = (item: RegulationImpactSchema) => {
    const title = removeRegPrefix(item.regTitle || '').trim()
    return title.endsWith('.') && !endsWithAbbreviation(title.slice(0, -1))
      ? title.slice(0, -1)
      : title
  }

  const amendingTitles = uniq(
    amendingArray.map((item) => {
      const title = titleOf(item)
      const name = removeRegNamePrefix(item.name)
      return title ? `${title}, nr. ${name}` : `nr. ${name}`
    }),
  )

  // "breytingu á reglugerð um A, nr. 1/2020, reglugerð um B, nr. 2/2020 og …"
  const prefixedAmendingTitles = amendingTitles.map(
    (title, i) => `${i === 0 ? PREFIX_AMENDING : 'reglugerð '}${title}`,
  )

  const repealTitles = repealArray.map((item, i) =>
    `${i === 0 ? PREFIX_REPEALING : 'reglugerðar '}nr. ${removeRegNamePrefix(
      item.name,
    )} ${titleOf(item)}`.trim(),
  )

  const joined = joinWithOg([...prefixedAmendingTitles, ...repealTitles])
  if (!joined) {
    return prefix
  }
  // Titles end with a period, as in Stjórnartíðindi
  return (prefix + joined + (joined.endsWith('.') ? '' : '.')).replace(
    / +(?= )/g,
    '',
  )
}

// ----------------------------------------------------------------------

/**
 * Title number of a neighbouring article group ("3. gr.") to place a new
 * article before or after. Uses the base regulation's numbering, or the new
 * one when the neighbour is itself new.
 */
const getNeighbourTitle = (group: HTMLElement[] | undefined): string => {
  const title = group?.[0]
  if (!title || !containsAnyTitleClass(title)) {
    return ''
  }
  const titleText = (removeTag: 'ins' | 'del') => {
    const clone = title.cloneNode(true) as HTMLElement
    clone.querySelectorAll(removeTag).forEach((e) => e.remove())
    return extractArticleTitleDisplay(getTextWithSpaces(clone))
  }
  return escapeHtml(titleText('ins') || titleText('del'))
}

const NEW_PARAGRAPH_COUNT = ['', 'ein', 'tvær', 'þrjár', 'fjórar']

/**
 * One or more new paragraphs added at the same place. They are written as
 * one amendment, since separate "Á eftir 2. mgr." amendments would reverse
 * their order.
 *
 * @param paragraph - the base paragraph they follow, 0 before the first one
 * @param where - "1. gr. reglugerðarinnar"
 */
const formatNewParagraphs = (
  paragraph: number,
  where: string,
  texts: string[],
): HTMLText => {
  const paragraphs = texts.map((text) => `<p>${text}</p>`).join('')
  if (texts.length === 1) {
    return (
      paragraph > 0
        ? `<p>Á eftir ${paragraph}. mgr. ${where} kemur ný málsgrein sem orðast svo:</p>${paragraphs}`
        : `<p>Á undan 1. mgr. ${where} kemur ný málsgrein svohljóðandi: </p>${paragraphs}`
    ) as HTMLText
  }
  const position =
    paragraph > 0 ? `Á eftir ${paragraph}. mgr.` : 'Á undan 1. mgr.'
  const count = NEW_PARAGRAPH_COUNT[texts.length] ?? `${texts.length}`
  return `<p>${position} ${where} koma ${count} nýjar málsgreinar, svohljóðandi:</p>${paragraphs}` as HTMLText
}

const getTable = (element: Element): Element | null =>
  element.nodeName.toLowerCase() === 'table'
    ? element
    : element.querySelector(':scope > table')

/** An element as it reads after the change, keeping its markup. */
const afterChange = (element: Element): string => {
  const clone = element.cloneNode(true) as Element
  clone.querySelectorAll('del').forEach((e) => e.remove())
  clone
    .querySelectorAll('ins')
    .forEach((e) => e.replaceWith(...Array.from(e.childNodes)))
  return clone.outerHTML
}

/** Whether nothing is left once `tag` is removed: all inserted or all deleted. */
const isEmptyWithout = (element: Element, tag: 'ins' | 'del'): boolean => {
  const clone = element.cloneNode(true) as Element
  clone.querySelectorAll(tag).forEach((e) => e.remove())
  return !clone.textContent?.trim()
}

const isRemovedRow = (row: Element) => isEmptyWithout(row, 'del')

/**
 * A changed table, written the way amending regulations do: the header row
 * and the changed rows. Removed rows can't be shown that way, so then the
 * whole new table is given.
 *
 * @param ordinal - "2. " when the article has more than one table, else ""
 * @param where - "í 2. gr. reglugerðarinnar"
 */
const formatTableChange = (
  table: Element,
  ordinal: string,
  where: string,
): string => {
  const rows = Array.from(table.querySelectorAll('tr'))
  const changed = rows.filter((row) => row.querySelector('ins, del'))
  if (changed.some(isRemovedRow)) {
    // The diff keeps a removed row as an empty one
    const newTable = table.cloneNode(true) as Element
    newTable
      .querySelectorAll('tr')
      .forEach((row) => isRemovedRow(row) && row.remove())
    return `<p>${
      ordinal ? `${ordinal}tafla` : 'Tafla'
    } ${where} verður svohljóðandi:</p>${afterChange(newTable)}`
  }
  const [header] = rows
  const shownRows = [header, ...changed.filter((row) => row !== header)]
  return `<p>Í ${ordinal}töflu ${where} er gerð breyting, svohljóðandi:</p><table><tbody>${shownRows
    .map(afterChange)
    .join('')}</tbody></table>`
}

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
): ImpactBody => {
  const regName = removeRegNamePrefix(name)
  if (repeal) {
    const title = regTitle
      ? escapeHtml(regTitle.replace(/^reglugerð\s*/i, '').trim())
      : ''
    const text = `<p>Reglugerð nr. ${regName} ${title.replace(
      /\.$/,
      '',
    )} fellur brott.</p>` as HTMLText
    return { articles: [text], appendixes: [], authorities: [] }
  }

  if (!diff) {
    return { articles: [], appendixes: [], authorities: [] }
  }

  const additionArray: HTMLText[][] = []
  const authorities: string[] = []

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

    // New paragraphs in a row, merged into one amendment
    let newParagraphs: { index: number; texts: string[] } | undefined

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
        articleTitle = escapeHtml(extractArticleTitleDisplay(textContent))
        testGroup.titleObject.hasSubtitle = hasSubtitle(textContent)
        testGroup.titleObject.type = getArticleTitleType(element)
        testGroup.titleObject.text = articleTitle
        isSectionTitle = true
        paragraph = 0
      } else if (element.nodeName.toLowerCase() === 'p') {
        isParagraph = true
      } else if (element.nodeName.toLowerCase() === 'ol') {
        if (element.getAttribute('type')?.toLowerCase() === 'a') {
          isLetterList = true
        } else {
          isNumberList = true
        }
      }

      const table =
        isParagraph || isSectionTitle || isNumberList || isLetterList
          ? null
          : getTable(element)
      // Tables are numbered as in the base regulation, which an inserted
      // table is not part of.
      const baseTables = group.filter(
        (e) => getTable(e) && !isEmptyWithout(e, 'ins'),
      )
      const tableOrdinal =
        table && baseTables.length > 1 && baseTables.includes(element)
          ? `${baseTables.indexOf(element) + 1}. `
          : ''

      const hasDeletion = !!element.querySelector('del')
      const hasInsert = !!element.querySelector('ins')

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

      // Paragraphs are numbered as in the base regulation, which a newly
      // inserted paragraph is not part of.
      const isNewParagraph = isParagraph && hasInsert && isAddition
      if (isParagraph && !isNewParagraph) {
        paragraph++
      }
      if (!isNewParagraph) {
        newParagraphs = undefined
      }

      // The base regulation's authority, even if its gildistaka is being
      // amended too. oldText is already escaped.
      const authority = isParagraph ? extractAuthority(oldText) : undefined
      if (authority) {
        authorities.push(authority)
      }

      if (hasDeletion || hasInsert) {
        if (isDeleted) {
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
          } else if (table) {
            pushHtml = `<p>${
              tableOrdinal ? `${tableOrdinal}tafla` : 'Tafla'
            } í ${articleTitle} ${regNameDisplay} fellur brott.</p>` as HTMLText
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
            const where = `${articleTitle} ${regNameDisplay}`
            if (newParagraphs) {
              newParagraphs.texts.push(newText)
              testGroup.arr[newParagraphs.index] = formatNewParagraphs(
                paragraph,
                where,
                newParagraphs.texts,
              )
              return
            }
            newParagraphs = { index: testGroup.arr.length, texts: [newText] }
            pushHtml = formatNewParagraphs(paragraph, where, [newText])
          } else if (isSectionTitle) {
            testGroup.original?.push(`<p>${newText}</p>` as HTMLText)
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            const liCleanArray: (string | null)[] = []
            newTextElement.querySelectorAll('ins').forEach((e) => {
              if (e.textContent) liCleanArray.push(escapeHtml(e.textContent))
            })

            const newLiTextBody =
              liCleanArray.length > 0
                ? `<ol><li>${liCleanArray.join('</li><li>')}</li></ol>`
                : `<p>${newText}</p>`

            testGroup.original?.push(newLiTextBody as HTMLText)
            pushHtml = `<p>${
              isLetterList ? 'Stafliðum' : 'Töluliðum'
            } eftir ${paragraph}. mgr. ${articleTitle} ${regNameDisplay} er bætt við:</p>${newLiTextBody}` as HTMLText
          } else if (table) {
            const newTable = afterChange(table)
            testGroup.original?.push(newTable as HTMLText)
            pushHtml = `<p>${
              paragraph > 0 ? `Á eftir ${paragraph}. mgr.` : 'Á undan 1. mgr.'
            } ${articleTitle} ${regNameDisplay} kemur ný tafla, svohljóðandi:</p>${newTable}` as HTMLText
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
          } else if (table) {
            pushHtml = formatTableChange(
              table,
              tableOrdinal,
              `í ${articleTitle} ${regNameDisplay}`,
            ) as HTMLText
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
      return
    }

    const prevArticleTitleNumber = getNeighbourTitle(groupedArticles[i - 1])
    const nextArticleTitleNumber = prevArticleTitleNumber
      ? ''
      : getNeighbourTitle(groupedArticles[i + 1])
    if (
      testGroup.isAddition === true &&
      (prevArticleTitleNumber || nextArticleTitleNumber)
    ) {
      const articleTitleNumber = testGroup.titleObject.text
      const originalTextArray = testGroup.original?.length
        ? flatten(testGroup.original)
        : []

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
      const position = prevArticleTitleNumber
        ? `Á eftir ${prevArticleTitleNumber}`
        : `Á undan ${nextArticleTitleNumber}`
      additionArray.push([
        `<p>${position} ${regNameDisplay} kemur ${articleTypeText}, ${
          articleTitleNumber ? articleTitleNumber + ',' : ''
        }${
          testGroup.titleObject.hasSubtitle ? ' ásamt fyrirsögn,' : ''
        } svohljóðandi:</p> ${articleDisplayText}` as HTMLText,
      ])
    } else {
      additionArray.push(testGroup.arr)
    }
  })

  const appendixArticles: HTMLText[] = []
  appendixes?.forEach((apx, idx) => {
    if (apx.diff) {
      const defaultTitle = escapeHtml(apx.title ?? `Viðauki ${idx + 1}`)

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
        appendixArticles.push(`<p>${testAddTitle}</p>` as HTMLText)
      } else if (hasAnyChange(apx.diff)) {
        appendixArticles.push(`<p>${testChangeTitle}</p><p>[]</p>` as HTMLText)
      }
    }
  })

  return {
    articles: additionArray.flat(),
    appendixes: appendixArticles,
    authorities,
  }
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
  const hasMultipleTargets = Object.keys(grouped).length > 1

  const groups: ImpactGroup[] = Object.values(grouped).flatMap(
    (impactArr, regIndex) =>
      impactArr.map((item) => ({
        ...formatAmendingRegBody(
          item.type === 'repeal' || hasMultipleTargets ? item.name : '',
          item.type === 'repeal',
          item.type === 'amend' ? item.diff : undefined,
          item.regTitle,
          item.type === 'amend' ? item.appendixes : undefined,
        ),
        regIndex,
        date: item.date ? new Date(item.date) : undefined,
      })),
  )

  const htmlForEditor = formatAffectedAndPlaceAffectedAtEnd(groups)

  return compact(htmlForEditor).map(
    (item, i) =>
      `<h3 class="article__title">${i + 1}. gr.</h3>${item}` as HTMLText,
  )
}
