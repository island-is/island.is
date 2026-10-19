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
import uniq from 'lodash/uniq'
import {
  ArticleTitleType,
  containsAnyTitleClass,
  endsWithAbbreviation,
  escapeHtml,
  extractArticleTitleDisplay,
  extractAuthority,
  getArticleTitleType,
  getArticleTypeText,
  getTextWithSpaces,
  groupElementsByArticleTitleFromDiv,
  hasAnyChange,
  isLetteredList,
  removeDiffAttributes,
  removeInsertions,
  removeRegPrefix,
  splitArticleTitle,
  updateAppendixWording,
} from './formatAmendingUtils'
import { getDeletionOrAddition, getLiPoint } from './getDeletionOrAddition'

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
}

const joinWithOg = (arr: string[]): string =>
  arr.length < 2
    ? arr.join('')
    : `${arr.slice(0, -1).join(', ')} og ${arr[arr.length - 1]}`

const extractArticleNumber = (str: string): number | undefined => {
  const match = str.match(/(\d+)\. gr/)
  return match ? parseInt(match[1], 10) : undefined
}

const placeGildistakaAtEnd = (groups: ImpactGroup[]): HTMLText[] => {
  const articles = groups
    .flatMap((group) => {
      // Text without an article, like a chapter heading, stays after the
      // article before it.
      let articleNumber = 0
      return [
        ...group.articles.map((text) => {
          articleNumber = extractArticleNumber(text) ?? articleNumber
          return { text, regIndex: group.regIndex, articleNumber }
        }),
        ...group.appendixes.map((text) => ({
          text,
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

  // The amending regulation's own gildistaka, reusing the authority of the
  // regulations it amends. "[]" marks it for the editor to fill in. It names
  // no date: the dates of the changes are set with the date picker, and a
  // date written here would not follow when one of them is changed.
  const authorities = uniq(groups.flatMap((group) => group.authorities))
  const authority =
    authorities.length > 0 ? joinWithOg(authorities) : 'með heimild í []'

  return [
    ...articles.map((item) => item.text),
    `<p>Reglugerð þessi er sett ${authority} og öðlast þegar gildi.</p>` as HTMLText,
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
  return escapeHtml(
    extractArticleTitleDisplay(
      headingText(title, 'old') || headingText(title, 'new'),
    ),
  )
}

/**
 * A heading's text before or after the change, with the diff marks
 * unwrapped, so "<del>4</del><ins>5</ins>. gr." reads "4. gr." or "5. gr."
 * and not "4 5 . gr.".
 */
const headingText = (heading: Element, version: 'old' | 'new'): string => {
  const clone = heading.cloneNode(true) as Element
  if (version === 'old') {
    removeInsertions(clone)
  } else {
    clone.querySelectorAll('del').forEach((e) => e.remove())
  }
  clone
    .querySelectorAll('ins, del')
    .forEach((e) => e.replaceWith(...Array.from(e.childNodes)))
  clone.normalize()
  return getTextWithSpaces(clone)
}

/** Feminine, as málsgrein and grein are */
const COUNT_WORDS = [
  '',
  'ein',
  'tvær',
  'þrjár',
  'fjórar',
  'fimm',
  'sex',
  'sjö',
  'átta',
  'níu',
  'tíu',
]
const countWord = (count: number) => COUNT_WORDS[count] ?? `${count}`

/**
 * One amendment to a base article. `where` names the article
 * (" 2. gr. reglugerðarinnar"), or is empty when the amendment is a lettered
 * item under "Eftirfarandi breytingar verða á 2. gr. reglugerðarinnar:".
 */
type Amendment = (where: string) => HTMLText

type NewParagraphs = {
  /** The amendment's place in the article's amendments */
  index: number
  /** The base paragraph they follow, 0 before the first one */
  paragraph: number
  /** The new paragraphs, and any list inserted with them */
  blocks: string[]
  count: number
}

/**
 * One or more new paragraphs added at the same place. They are written as
 * one amendment, since separate "Á eftir 2. mgr." amendments would reverse
 * their order.
 *
 * @param atEnd - they follow the article's last paragraph
 */
const formatNewParagraphs = (
  { paragraph, blocks, count }: NewParagraphs,
  atEnd = false,
): Amendment => {
  const html = blocks.join('')
  return (where) => {
    if (atEnd && paragraph > 0) {
      const target = where ? `Við${where}` : 'Við greinina'
      return (
        count === 1
          ? `<p>${target} bætist ný málsgrein, svohljóðandi:</p>${html}`
          : `<p>${target} bætast ${countWord(
              count,
            )} nýjar málsgreinar, svohljóðandi:</p>${html}`
      ) as HTMLText
    }
    if (count === 1) {
      return (
        paragraph > 0
          ? `<p>Á eftir ${paragraph}. mgr.${where} kemur ný málsgrein sem orðast svo:</p>${html}`
          : `<p>Á undan 1. mgr.${where} kemur ný málsgrein svohljóðandi: </p>${html}`
      ) as HTMLText
    }
    const position =
      paragraph > 0 ? `Á eftir ${paragraph}. mgr.` : 'Á undan 1. mgr.'
    return `<p>${position}${where} koma ${countWord(
      count,
    )} nýjar málsgreinar, svohljóðandi:</p>${html}` as HTMLText
  }
}

type ArticleGroup = {
  /** "3. gr. a", as amending text cites it */
  title: string
  /** "Leyfissvipting.", escaped */
  subtitle: string
  type: ArticleTitleType
  /** An ákvæði til bráðabirgða, which has no article number */
  transitional: boolean
  amendments: Amendment[]
  /** The article's text after the change, for a new article */
  body: HTMLText[]
  isDeletion?: boolean
  isAddition?: boolean
}

const isNewArticle = (group: ArticleGroup) =>
  group.isAddition === true && !group.transitional && group.type === 'article'

/** A new article's subtitle, shown above its text as Stjórnartíðindi does */
const subtitleHtml = (group: ArticleGroup) =>
  group.subtitle
    ? `<p style="text-align: center;"><em>${group.subtitle}</em></p>`
    : ''

/**
 * New articles added at the same place, as one amendment: "Á eftir 3. gr.
 * reglugerðarinnar koma tvær nýjar greinar, 3. gr. a og 3. gr. b, …".
 *
 * @param position - "Á eftir 3. gr."
 */
const formatNewArticles = (
  position: string,
  regNameDisplay: string,
  groups: ArticleGroup[],
): HTMLText => {
  if (groups.length === 1) {
    const [group] = groups
    return `<p>${position} ${regNameDisplay} kemur ${getArticleTypeText(
      group.type,
    )}, ${group.title ? group.title + ',' : ''}${
      group.subtitle ? ' ásamt fyrirsögn,' : ''
    } svohljóðandi:</p> ${subtitleHtml(group)}${group.body.join(
      '',
    )}` as HTMLText
  }
  const withSubtitle = groups.filter((group) => group.subtitle).length
  return `<p>${position} ${regNameDisplay} koma ${countWord(
    groups.length,
  )} nýjar greinar, ${joinWithOg(compact(groups.map((g) => g.title)))},${
    withSubtitle > 1
      ? ' ásamt fyrirsögnum,'
      : withSubtitle
      ? ' ásamt fyrirsögn,'
      : ''
  } svohljóðandi:</p> ${groups
    .map(
      (group, i) =>
        `<p>${getLiPoint(i + 1, true)}. (${group.title})</p>${subtitleHtml(
          group,
        )}${group.body.join('')}`,
    )
    .join('')}` as HTMLText
}

const getTable = (element: Element): Element | null =>
  element.nodeName.toLowerCase() === 'table'
    ? element
    : element.querySelector(':scope > table')

/**
 * The formatting-only change in a paragraph whose wording did not change:
 * nothing deleted, and everything inserted is `<ins class="mod">`. Returns
 * the reformatted words, or `true` when the whole paragraph was reformatted,
 * or `undefined` when the paragraph is not a formatting-only change.
 */
const getFormatOnlyChange = (
  paragraph: Element,
): string[] | true | undefined => {
  const inserted = Array.from(paragraph.querySelectorAll('ins'))
  if (
    paragraph.querySelector('del') ||
    !inserted.length ||
    !inserted.every((e) => e.classList.contains('mod'))
  ) {
    return undefined
  }
  const words = uniq(
    compact(inserted.map((e) => e.textContent?.replace(/\s+/g, ' ').trim())),
  )
  if (!words.length) {
    // Only whitespace was reformatted: nothing to name
    return undefined
  }
  const all = (paragraph.textContent || '').replace(/\s+/g, ' ').trim()
  return words.join(' ') === all ? true : words
}

/** „a“, „b“ og „c“ */
const quoteWords = (words: string[]) => {
  const quoted = words.map((w) => `„${escapeHtml(w)}“`)
  return quoted.length > 1
    ? `${quoted.slice(0, -1).join(', ')} og ${quoted[quoted.length - 1]}`
    : quoted[0]
}

/**
 * Whether the list itself changed type and nothing in it did: the structured
 * diff then marks the list as a formatting change and shows only its new
 * version, with no item marked. A formatting change inside the items marks
 * the items instead.
 */
const isWholeListFormatChange = (list: Element): boolean =>
  list.getAttribute('data-diff-change') === 'format' &&
  list.getAttribute('data-diff-side') === 'new' &&
  !list.querySelector('li[data-diff]')

const isListTypeChange = (list: Element): boolean =>
  isWholeListFormatChange(list) &&
  // With a list nested in it, the markup does not say which list changed
  // type: getStructuredDiff marks the outer list either way.
  !list.querySelector('ol, ul')

/**
 * The new version of a list replaced as a whole: getStructuredDiff gives the
 * old list, all deleted, followed by the new one, all inserted, when a list
 * changed type and wording at once.
 */
const getReplacingList = (list: Element): Element | undefined => {
  const next = list.nextElementSibling
  return list.getAttribute('data-diff') === 'replace' &&
    list.getAttribute('data-diff-side') === 'old' &&
    next?.nodeName === list.nodeName &&
    next.getAttribute('data-diff') === 'replace' &&
    next.getAttribute('data-diff-side') === 'new' &&
    next.getAttribute('data-diff-mgr') === list.getAttribute('data-diff-mgr')
    ? next
    : undefined
}

/** An element as it reads after the change, keeping its markup. */
const afterChange = (element: Element): string => {
  const clone = element.cloneNode(true) as Element
  clone.querySelectorAll('del').forEach((e) => e.remove())
  clone
    .querySelectorAll('ins')
    .forEach((e) => e.replaceWith(...Array.from(e.childNodes)))
  removeDiffAttributes(clone)
  return clone.outerHTML
}

/** Whether nothing is left once `tag` is removed: all inserted or all deleted. */
const isEmptyWithout = (element: Element, tag: 'ins' | 'del'): boolean => {
  const clone = element.cloneNode(true) as Element
  if (tag === 'ins') {
    removeInsertions(clone)
  } else {
    clone.querySelectorAll(tag).forEach((e) => e.remove())
  }
  return !clone.textContent?.trim()
}

const isRemovedRow = (row: Element) => isEmptyWithout(row, 'del')

/**
 * A changed table, written the way amending regulations do: the header row
 * and the changed rows. Removed rows can't be shown that way, so then the
 * whole new table is given.
 *
 * @param ordinal - "2. " when the article has more than one table, else ""
 * @param where - " í 2. gr. reglugerðarinnar", or "" within the article
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
    }${where} verður svohljóðandi:</p>${afterChange(newTable)}`
  }
  const [header] = rows
  const shownRows = [header, ...changed.filter((row) => row !== header)]
  return `<p>Í ${ordinal}töflu${where} er gerð breyting, svohljóðandi:</p><table><tbody>${shownRows
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

  const authorities: string[] = []

  const diffString = diff as string
  const diffDiv = asDiv(diffString)

  let paragraph = 0
  const groupedArticles = groupElementsByArticleTitleFromDiv(diffDiv)

  const regNameDisplay =
    regName && regName !== 'self'
      ? `reglugerðar nr. ${regName}`.replace(/\.$/, '')
      : 'reglugerðarinnar'
  const regNameAddition =
    regName && regName !== 'self'
      ? `reglugerð nr. ${regName}`.replace(/\.$/, '')
      : 'reglugerðina'

  const articleGroups = groupedArticles.map((group) => {
    const testGroup: ArticleGroup = {
      title: '',
      subtitle: '',
      type: 'article',
      transitional: false,
      amendments: [],
      body: [],
      isDeletion: undefined,
      isAddition: undefined,
    }

    // New paragraphs in a row, merged into one amendment
    let newParagraphs: NewParagraphs | undefined

    // The new side of a list already written together with its old side
    const handled = new Set<Element>()

    group.forEach((element) => {
      // The closing date line and signatories: never an amendment.
      if (element.hasAttribute('data-diff-signature') || handled.has(element)) {
        return
      }
      let amendment: Amendment | undefined

      let isParagraph = false
      let isSectionTitle = false
      let isNumberList = false
      let isLetterList = false
      const containsAnyTitle = containsAnyTitleClass(element)
      if (containsAnyTitle) {
        // The base regulation's number, as amending text cites it; the new
        // one only for an article that did not exist before.
        const textContent =
          headingText(element, 'old') || headingText(element, 'new')
        const { display, subtitle } = splitArticleTitle(textContent)
        testGroup.title = escapeHtml(display)
        testGroup.subtitle = escapeHtml(subtitle)
        testGroup.type = getArticleTitleType(element)
        // "Ákvæði til bráðabirgða" or "Bráðabirgðaákvæði", with no number
        testGroup.transitional =
          display === textContent && /bráðabirgð/i.test(textContent)
        isSectionTitle = true
        paragraph = 0
      } else if (element.nodeName.toLowerCase() === 'p') {
        isParagraph = true
      } else if (element.nodeName.toLowerCase() === 'ol') {
        if (isLetteredList(element)) {
          isLetterList = true
        } else {
          isNumberList = true
        }
      }

      // The paragraph a list or table follows
      const mgr = paragraph

      const replacingList =
        isLetterList || isNumberList ? getReplacingList(element) : undefined
      const replacedByLettered = isLetteredList(replacingList)
      if (replacingList) {
        handled.add(replacingList)
        newParagraphs = undefined
        testGroup.isDeletion = false
        testGroup.isAddition = false
        const items = isLetterList ? 'Stafliðir' : 'Töluliðir'
        const newList = afterChange(replacingList)
        testGroup.amendments.push(
          (where) =>
            ((replacedByLettered !== isLetterList
              ? `<p>${items} í ${mgr}. mgr.${where} verða ${
                  isLetterList ? 'töluliðir' : 'stafliðir'
                } og orðast svo:</p>`
              : `<p>${items} í ${mgr}. mgr.${where} orðast svo:</p>`) +
              newList) as HTMLText,
        )
        return
      }

      // A list holding a nested list whose formatting changed as a whole: one
      // of them changed type, but the markup does not say which. Leave it to
      // the author rather than name the wrong list.
      if (
        (isLetterList || isNumberList) &&
        isWholeListFormatChange(element) &&
        !isListTypeChange(element)
      ) {
        newParagraphs = undefined
        testGroup.isDeletion = false
        testGroup.isAddition = false
        return
      }

      if ((isLetterList || isNumberList) && isListTypeChange(element)) {
        newParagraphs = undefined
        testGroup.isDeletion = false
        testGroup.isAddition = false
        testGroup.amendments.push(
          (where) =>
            `<p>${
              isLetterList ? 'Töluliðir' : 'Stafliðir'
            } í ${mgr}. mgr.${where} verða ${
              isLetterList ? 'stafliðir' : 'töluliðir'
            }.</p>` as HTMLText,
        )
        return
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
      const tableName = tableOrdinal ? `${tableOrdinal}tafla` : 'Tafla'

      // A heading only renumbered by an article inserted or removed before it
      // is not itself an amendment. getStructuredDiff adds data-diff to a
      // heading only when its text changed.
      const renumberedOnly =
        isSectionTitle &&
        element.hasAttribute('data-diff-renumbered-to') &&
        !element.hasAttribute('data-diff')
      const hasDeletion = !renumberedOnly && !!element.querySelector('del')
      const hasInsert = !renumberedOnly && !!element.querySelector('ins')

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
      // A list inserted as a whole belongs with the new paragraph before it
      const isNewList =
        (isLetterList || isNumberList) &&
        hasInsert &&
        isAddition &&
        isEmptyWithout(element, 'ins')
      if (isParagraph && !isNewParagraph) {
        paragraph++
      }
      if (!isNewParagraph && !isNewList) {
        newParagraphs = undefined
      }
      const paragraphNumber = paragraph

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
            amendment = (where) =>
              `<p>${paragraphNumber}. mgr.${where} fellur brott.</p>` as HTMLText
          } else if (isSectionTitle) {
            amendment = (where) =>
              `<p>Fyrirsögn${
                where || ' greinarinnar'
              } fellur brott.</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            amendment = (where) =>
              `<p>${
                isLetterList ? 'Stafliðir' : 'Töluliðir'
              } eftir ${mgr}. mgr.${where} falla brott.</p>` as HTMLText
          } else if (table) {
            amendment = (where) =>
              `<p>${tableName}${
                where ? ` í${where}` : ''
              } fellur brott.</p>` as HTMLText
          } else {
            amendment = (where) =>
              `<p>Texti${
                where ? ` í${where}` : ''
              } fellur brott:</p><p>${oldText}</p>` as HTMLText
          }
        } else if (isAddition) {
          testGroup.isDeletion = false
          if (testGroup.isAddition !== false) {
            testGroup.isAddition = true
          }
          if (isParagraph) {
            const html = `<p>${newText}</p>`
            testGroup.body.push(html as HTMLText)
            if (newParagraphs) {
              newParagraphs.blocks.push(html)
              newParagraphs.count++
              testGroup.amendments[newParagraphs.index] =
                formatNewParagraphs(newParagraphs)
              return
            }
            newParagraphs = {
              index: testGroup.amendments.length,
              paragraph: paragraphNumber,
              blocks: [html],
              count: 1,
            }
            amendment = formatNewParagraphs(newParagraphs)
          } else if (isSectionTitle) {
            // A new article's heading is given apart from its text
            amendment = (where) =>
              `<p>Fyrirsögn${
                where || ' greinarinnar'
              } orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            let newList = afterChange(element)
            if (!isNewList) {
              // Items added to a list: the new items alone
              const liCleanArray: string[] = []
              newTextElement.querySelectorAll('ins').forEach((e) => {
                if (e.textContent) liCleanArray.push(escapeHtml(e.textContent))
              })
              newList =
                liCleanArray.length > 0
                  ? `<ol${
                      isLetterList ? ' type="a"' : ''
                    }><li>${liCleanArray.join('</li><li>')}</li></ol>`
                  : `<p>${newText}</p>`
            }

            testGroup.body.push(newList as HTMLText)
            if (newParagraphs && isNewList) {
              newParagraphs.blocks.push(newList)
              testGroup.amendments[newParagraphs.index] =
                formatNewParagraphs(newParagraphs)
              return
            }
            amendment = (where) =>
              `<p>${
                isLetterList ? 'Stafliðum' : 'Töluliðum'
              } eftir ${mgr}. mgr.${where} er bætt við:</p>${newList}` as HTMLText
          } else if (table) {
            const newTable = afterChange(table)
            testGroup.body.push(newTable as HTMLText)
            amendment = (where) =>
              `<p>${
                mgr > 0 ? `Á eftir ${mgr}. mgr.` : 'Á undan 1. mgr.'
              }${where} kemur ný tafla, svohljóðandi:</p>${newTable}` as HTMLText
          } else {
            testGroup.body.push(`<p>${newText}</p>` as HTMLText)
            amendment = (where) =>
              `<p>Eftirfarandi texta${
                where ? ` ${regNameDisplay}` : ''
              } var bætt við:</p><p>${newText}</p>` as HTMLText
          }
        } else {
          // Change detected. Not addition, not deletion.
          testGroup.isDeletion = false
          testGroup.isAddition = false
          if (isSectionTitle) {
            // Formatting alone changed: the wording did not, so it is not
            // restated.
            const formatOnly = getFormatOnlyChange(element)
            amendment = (where) =>
              (formatOnly
                ? `<p>Snið fyrirsagnar${
                    where || ' greinarinnar'
                  } hefur breyst.</p>`
                : `<p>Fyrirsögn${
                    where || ' greinarinnar'
                  } breytist og orðast svo:</p><p>${newText}</p>`) as HTMLText
          } else if (isParagraph) {
            // Formatting alone changed: the wording did not, so it is not
            // restated.
            const formatOnly = getFormatOnlyChange(element)
            amendment = (where) => {
              const at = `${paragraphNumber}. mgr.${where}`
              return (
                formatOnly === true
                  ? `<p>Snið ${at} hefur breyst.</p>`
                  : formatOnly
                  ? `<p>Snið ${quoteWords(
                      formatOnly,
                    )} í ${at} hefur breyst.</p>`
                  : `<p>${at} breytist og orðast svo:</p><p>${newText}</p>`
              ) as HTMLText
            }
          } else if (isLetterList || isNumberList) {
            // A list whose items changed formatting only can leave nothing
            // to say
            if (liHtml) {
              amendment = (where) =>
                `<p>Eftirfarandi breytingar verða á ${mgr}. mgr.${where}:</p> ${liHtml}` as HTMLText
            }
          } else if (table) {
            amendment = (where) =>
              formatTableChange(
                table,
                tableOrdinal,
                where ? ` í${where}` : '',
              ) as HTMLText
          } else {
            amendment = (where) =>
              `<p>Eftirfarandi breytingar${
                where ? ` ${regNameDisplay}` : ''
              } áttu sér stað:</p><p>${
                oldText ? `Í stað ${oldText} kemur ` : ''
              }${newText}</p>` as HTMLText
          }
        }
        if (amendment) {
          testGroup.amendments.push(amendment)
        }
      } else {
        testGroup.isDeletion = false
        testGroup.isAddition = false
      }
    })

    // New paragraphs still open at the end follow the article's last one
    if (newParagraphs) {
      testGroup.amendments[newParagraphs.index] = formatNewParagraphs(
        newParagraphs,
        true,
      )
    }
    return testGroup
  })

  const articles: HTMLText[] = []
  for (let i = 0; i < articleGroups.length; i++) {
    const group = articleGroups[i]
    const where = ` ${group.title} ${regNameDisplay}`

    if (group.isDeletion === true) {
      articles.push(
        `<p>${group.title} ${regNameDisplay} fellur brott.</p>` as HTMLText,
      )
      continue
    }

    if (group.isAddition === true && group.transitional) {
      articles.push(
        `<p>Við ${regNameAddition} bætist nýtt ákvæði til bráðabirgða, svohljóðandi:</p>${group.body.join(
          '',
        )}` as HTMLText,
      )
      continue
    }

    if (group.isAddition === true) {
      // New articles in a row are one amendment, placed by the article
      // before them, or after them when they come first.
      let end = i + 1
      if (isNewArticle(group)) {
        while (end < articleGroups.length && isNewArticle(articleGroups[end])) {
          end++
        }
      }
      const prevArticleTitleNumber = getNeighbourTitle(groupedArticles[i - 1])
      const nextArticleTitleNumber = prevArticleTitleNumber
        ? ''
        : getNeighbourTitle(groupedArticles[end])
      if (prevArticleTitleNumber || nextArticleTitleNumber) {
        articles.push(
          formatNewArticles(
            prevArticleTitleNumber
              ? `Á eftir ${prevArticleTitleNumber}`
              : `Á undan ${nextArticleTitleNumber}`,
            regNameDisplay,
            articleGroups.slice(i, end),
          ),
        )
        i = end - 1
        continue
      }
    }

    // Several changes to one article are one amendment, lettered
    if (
      group.amendments.length > 1 &&
      group.type === 'article' &&
      group.title
    ) {
      articles.push(
        `<p>Eftirfarandi breytingar verða á${where}:</p><ol type="a">${group.amendments
          .map((amendment) => `<li>${amendment('')}</li>`)
          .join('')}</ol>` as HTMLText,
      )
    } else {
      articles.push(...group.amendments.map((amendment) => amendment(where)))
    }
  }

  // A new appendix is usually named in the text that refers to it. Its own
  // article is only added when no amendment mentions one.
  const mentionsAppendix = articles.some((text) =>
    /fylgiskj|viðauk/i.test(text),
  )

  const appendixArticles: HTMLText[] = []
  appendixes?.forEach((apx, idx) => {
    if (apx.diff) {
      const defaultTitle = escapeHtml(apx.title ?? `Viðauki ${idx + 1}`)
      const name = defaultTitle.replace(/\.$/, '')

      const regNameChange =
        regName && regName !== 'self'
          ? `, reglugerðar nr. ${regName}`.replace(/\.$/, '')
          : ''

      const testAddTitle = /fylgiskjal/i.test(name)
        ? `Við ${regNameAddition} bætist nýtt fylgiskjal${
            /^fylgiskjal$/i.test(name) ? '' : `, ${name},`
          } sem birt er með reglugerð þessari.`
        : `Við ${regNameAddition} bætist nýr viðauki, ${name}, sem birtur er með reglugerð þessari.`
      const testChangeTitle = `Eftirfarandi breytingar eru gerðar á ${updateAppendixWording(
        defaultTitle,
      )}${regNameChange}:`

      if (apx.diff.includes('<div data-diff="new">')) {
        if (!mentionsAppendix) {
          appendixArticles.push(`<p>${testAddTitle}</p>` as HTMLText)
        }
      } else if (hasAnyChange(apx.diff)) {
        appendixArticles.push(`<p>${testChangeTitle}</p><p>[]</p>` as HTMLText)
      }
    }
  })

  return {
    articles,
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
      })),
  )

  const htmlForEditor = placeGildistakaAtEnd(groups)

  return compact(htmlForEditor).map(
    (item, i) =>
      `<h3 class="article__title">${i + 1}. gr.</h3>${item}` as HTMLText,
  )
}
