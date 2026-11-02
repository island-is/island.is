/**
 * Ported from: libs/portals/admin/regulations-admin/src/utils/getDeletionOrAddition.ts
 *
 * Parses diff HTML elements containing <ins>/<del> tags and
 * determines whether each element is an addition, deletion, or modification.
 */
import qq from '@hugsmidjan/qj/qq'
import { HTMLText } from '@island.is/regulations'
import {
  escapeHtml,
  isLetteredList,
  removeDiffAttributes,
  removeInsertions,
} from './formatAmendingUtils'

export const getLiPoint = (num: number, isStaflidur: boolean) => {
  const charNum = num > 22 ? 23 : num - 1
  const bulletPoint = isStaflidur ? String.fromCharCode(97 + charNum) : num

  return bulletPoint
}

/**
 * One change to a list item, as amending text words it. `at` is where the
 * list is, " 1. mgr. 2. gr. reglugerðarinnar", or "" when the change is a
 * lettered item under the article.
 */
export type ListItemChange = (at: string) => HTMLText

/** Masculine, as liður is */
const COUNT_WORDS = ['', 'einn', 'tveir', 'þrír', 'fjórir']
const countWord = (count: number) => COUNT_WORDS[count] ?? `${count}`

const listItems = (li: Element) =>
  Array.from(li.parentElement?.children ?? []).filter(
    (e) => e.nodeName.toLowerCase() === 'li',
  )

const isInBase = (li: Element) => {
  const old = li.cloneNode(true) as Element
  removeInsertions(old)
  return !!old.textContent?.trim()
}

/**
 * An item's number in the base regulation: the base items up to it. For a
 * new item, that of the base item before it, or 0 when it comes first.
 */
const baseNumber = (li: Element) => {
  const items = listItems(li)
  return items.slice(0, items.indexOf(li) + 1).filter(isInBase).length
}

/** "3. tölul." or "c-liður", in the case the wording needs */
const itemLabel = (
  li: Element,
  form: 'nom' | 'short' | 'dat' | 'gen',
  num = baseNumber(li),
) => {
  const isStaflidur = isLetteredList(li.parentElement)
  const point = getLiPoint(num, isStaflidur)
  if (isStaflidur) {
    return `${point}-${
      { nom: 'liður', short: 'liður', dat: 'lið', gen: 'liðar' }[form]
    }`
  }
  return `${point}. ${
    { nom: 'töluliður', short: 'tölul.', dat: 'tölulið', gen: 'tölul.' }[form]
  }`
}

export const formatListItemDiff = (item: Element): ListItemChange[] => {
  let oldLiText = ''
  let newLiText = ''
  const returningArray: ListItemChange[] = []
  // " a-liðar 4. tölul." for an item in a list nested in other items
  const labelsAbove = (liItem: Element) => {
    let labels = ''
    for (
      let li = liItem.parentElement?.closest('li');
      li && item.contains(li);
      li = li.parentElement?.closest('li')
    ) {
      labels += ` ${itemLabel(li, 'gen')}`
    }
    return labels
  }
  // Items added after a list's last base item, one amendment per list
  const appended = new Map<Element, string[]>()
  // Items restated, added or removed as a whole, with any list nested in them
  const wholeItems = new Set<Element>()
  const isInWholeItem = (liItem: Element) => {
    for (
      let li = liItem.parentElement?.closest('li');
      li && item.contains(li);
      li = li.parentElement?.closest('li')
    ) {
      if (wholeItems.has(li)) return true
    }
    return false
  }
  qq('ol > li', item).forEach((liItem) => {
    if (isInWholeItem(liItem)) {
      return
    }
    const liHasDeletion = !!liItem.querySelector('del')
    const liHasInsert = !!liItem.querySelector('ins')

    if (liHasDeletion || liHasInsert) {
      const above = labelsAbove(liItem)
      const isStaflidur = isLetteredList(liItem?.parentElement)

      // Formatting changed, wording did not: nothing deleted, and everything
      // inserted is <ins class="mod">. Only the item's own marks count; a
      // change inside a list nested in it goes through the nested path below.
      const ownMarks = Array.from(liItem.querySelectorAll('ins, del')).filter(
        (e) => e.closest('li') === liItem,
      )
      const isFormatOnly =
        ownMarks.length > 0 &&
        ownMarks.every(
          (e) =>
            e.nodeName.toLowerCase() === 'ins' && e.classList.contains('mod'),
        )
      if (isFormatOnly) {
        // Changes in a list nested in this item follow, cited under it
        const label = `${itemLabel(liItem, 'gen')}${above}`
        returningArray.push(
          (at) => `<p>Snið ${label}${at} hefur breyst.</p>` as HTMLText,
        )
        return
      }

      const oldLiElement = liItem.cloneNode(true) as Element
      removeInsertions(oldLiElement)
      oldLiText = oldLiElement.textContent || ''

      const newLiElement = liItem.cloneNode(true) as Element
      newLiElement.querySelectorAll('del').forEach((e) => e.remove())
      newLiText = escapeHtml(newLiElement.textContent || '')

      // A list nested in the item is restated after the item's own text, as
      // a list: in the item's text it would run together.
      const nestedLists = Array.from(newLiElement.children).filter((e) =>
        ['ol', 'ul'].includes(e.nodeName.toLowerCase()),
      )
      nestedLists.forEach((list) => {
        list.remove()
        list
          .querySelectorAll('ins')
          .forEach((e) => e.replaceWith(...Array.from(e.childNodes)))
        // A removed item is left empty by removing what was deleted
        list.querySelectorAll('li').forEach((li) => {
          if (!li.textContent?.trim()) li.remove()
        })
        removeDiffAttributes(list)
      })
      const ownLiText = escapeHtml(newLiElement.textContent || '')
      const nestedListHtml = nestedLists.map((list) => list.outerHTML)

      const directArray = Array.from(liItem.children)
      const containsDirect = directArray.find((e) => {
        let returning = false
        const containing =
          e.classList.contains('diffdel') ||
          e.classList.contains('diffmod') ||
          e.classList.contains('diffins')
        if (containing) {
          returning = true
        }
        const needsMoreDrilling =
          e.nodeName.toLowerCase() === 'em' ||
          e.nodeName.toLowerCase() === 'strong'
        if (needsMoreDrilling) {
          const nestedArray = Array.from(e.children)
          returning = !!nestedArray.find(
            (ee) =>
              ee.classList.contains('diffdel') ||
              ee.classList.contains('diffins') ||
              ee.classList.contains('diffmod'),
          )
        }
        return returning
      })

      if (!containsDirect) {
        // Only a list nested in the item changed: its items follow, cited
        // under this one.
        return
      }
      wholeItems.add(liItem)

      const isLiDeleted = newLiText === '' || newLiText === null
      const isLiAddition = oldLiText === '' || oldLiText === null

      // Other items are only renumbered if an item that is both in the old
      // and the new list follows this one
      const siblings = listItems(liItem)
      const renumbersOthers = siblings
        .slice(siblings.indexOf(liItem) + 1)
        .some((sibling) => {
          const oldSibling = sibling.cloneNode(true) as Element
          removeInsertions(oldSibling)
          const newSibling = sibling.cloneNode(true) as Element
          newSibling.querySelectorAll('del').forEach((e) => e.remove())
          return (
            !!oldSibling.textContent?.trim() && !!newSibling.textContent?.trim()
          )
        })

      const nested = nestedListHtml.join('')
      const kind = isStaflidur ? 'stafliður' : 'töluliður'

      if (isLiDeleted) {
        const label = `${itemLabel(liItem, 'nom')}${above}`
        returningArray.push(
          (at) =>
            `<p>${label}${at} fellur brott${
              renumbersOthers
                ? ' og breytist númer annarra liða til samræmis'
                : ''
            }.</p>` as HTMLText,
        )
      } else if (isLiAddition && !renumbersOthers) {
        // After the list's last base item: "Við 1. mgr. bætist nýr
        // töluliður", with any items added after it in the same amendment
        const list = liItem.parentElement as Element
        const items = appended.get(list)
        if (items) {
          items.push(`<li>${ownLiText}${nested}</li>`)
          return
        }
        const added = [`<li>${ownLiText}${nested}</li>`]
        appended.set(list, added)
        // A nested list is added to the item it is in
        const parent = list.parentElement?.closest('li')
        const target =
          parent && item.contains(parent)
            ? ` ${itemLabel(parent, 'dat')}${labelsAbove(parent)}`
            : ''
        const start = baseNumber(liItem) + 1
        returningArray.push((at) => {
          const what =
            added.length === 1
              ? `bætist nýr ${kind}`
              : `bætast ${countWord(added.length)} nýir ${
                  isStaflidur ? 'stafliðir' : 'töluliðir'
                }`
          return `<p>Við${target}${at} ${what}, svohljóðandi:</p><ol${
            isStaflidur ? ' type="a"' : ''
          }${start > 1 ? ` start="${start}"` : ''}>${added.join(
            '',
          )}</ol>` as HTMLText
        })
      } else if (isLiAddition) {
        const number = baseNumber(liItem)
        const position =
          number > 0
            ? `Á eftir ${itemLabel(liItem, 'dat', number)}`
            : `Á undan ${itemLabel(liItem, 'dat', 1)}`
        returningArray.push(
          (at) =>
            `<p>${position}${above}${at} kemur nýr ${kind}, svohljóðandi, og breytist númer annarra liða til samræmis: ${ownLiText}</p>${nested}` as HTMLText,
        )
      } else {
        const label = `${itemLabel(liItem, 'short')}${above}`
        returningArray.push(
          (at) =>
            `<p>${label}${at} orðast svo: ${ownLiText}</p>${nested}` as HTMLText,
        )
      }
    }
  })
  return returningArray
}

export const getDeletionOrAddition = (
  item: Element,
  type?: 'lidur' | 'greinTitle',
) => {
  let oldText = ''
  let newText = ''

  const oldTextElement = item.cloneNode(true) as Element
  const newTextElement = item.cloneNode(true) as Element

  removeInsertions(oldTextElement)
  oldText = oldTextElement.textContent || ''

  newTextElement.querySelectorAll('del').forEach((e) => e.remove())
  newText = newTextElement.textContent || ''

  let liChanges: ListItemChange[] = []
  if (type === 'lidur') {
    liChanges = formatListItemDiff(item)
    newText = escapeHtml(newText)
  } else {
    if (type === 'greinTitle') {
      const tempElement = newTextElement

      // A renumbered heading's new number (<ins>3</ins>. gr.) is not part of
      // the title; unwrap it so the "N. gr." label can be split off below.
      const [leadingIns] = Array.from(tempElement.querySelectorAll('ins'))
      if (
        leadingIns &&
        /^\d+$/.test(leadingIns.textContent?.trim() ?? '') &&
        (tempElement.textContent ?? '')
          .trimStart()
          .startsWith(`${leadingIns.textContent?.trim()}.`)
      ) {
        leadingIns.replaceWith(leadingIns.textContent ?? '')
      }

      const insElements = tempElement.querySelectorAll('ins')

      insElements.forEach((insElement) => {
        // Formatting changed, text did not: nothing new to break the line on.
        if (insElement.classList.contains('mod')) {
          return
        }
        const content = insElement.textContent
        insElement.textContent = ` ${content}<br />`
      })

      const modifiedTextContent = tempElement?.textContent?.trim()

      // Escape the text but keep the <br /> added above.
      const modContent = escapeHtml(modifiedTextContent ?? '').replace(
        /&lt;br \/&gt;/g,
        '<br />',
      )
      const match = modContent.match(/^\d+\.\s*gr\.\s*(<br\s*\/?>)?$/)
      if (match) {
        newText = modContent
      } else {
        const parts = modContent.split(/^\d+\.\s*gr\.\s*/)
        newText = parts[1] ? parts[1] : modContent
      }
    } else {
      newText = escapeHtml(newTextElement.textContent || '')
    }
  }
  oldText = escapeHtml(oldText)

  const isDeleted = newText === '' || newText === null || newText === '<br />'
  const isAddition = oldText === '' || oldText === null

  return {
    newText,
    oldText,
    isDeleted,
    isAddition,
    liChanges,
    newTextElement,
  }
}
