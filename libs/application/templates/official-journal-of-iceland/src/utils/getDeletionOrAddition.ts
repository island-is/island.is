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

export const formatListItemDiff = (item: Element) => {
  let oldLiText = ''
  let newLiText = ''
  let liItemHtml = '' as HTMLText
  const returningArray: HTMLText[] = []
  // "Töluliður 1, " for an item whose nested list has changes, so each of
  // them is cited under it, not only the first.
  const parentLabels = new Map<Element, string>()
  const labelsAbove = (liItem: Element) => {
    let labels = ''
    for (
      let li = liItem.parentElement?.closest('li');
      li && item.contains(li);
      li = li.parentElement?.closest('li')
    ) {
      labels = (parentLabels.get(li) ?? '') + labels
    }
    return labels as HTMLText
  }
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
    // The item's number in its own list. The loop also visits the items of
    // nested lists, so a running count numbered every item after a nested
    // list too high.
    const lidur =
      Array.from(liItem.parentElement?.children ?? [])
        .filter((e) => e.nodeName.toLowerCase() === 'li')
        .indexOf(liItem) + 1

    const liHasDeletion = !!liItem.querySelector('del')
    const liHasInsert = !!liItem.querySelector('ins')

    if (liHasDeletion || liHasInsert) {
      liItemHtml = labelsAbove(liItem)
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
        returningArray.push(
          `${liItemHtml}${liItemHtml ? 'snið' : 'Snið'} ${getLiPoint(
            lidur,
            isStaflidur,
          )}${isStaflidur ? '-liðar' : '. tölul.'} hefur breyst.` as HTMLText,
        )
        // Changes in a list nested in this item follow, and are cited under it
        const hasNestedChange =
          liItem.querySelectorAll('ins, del').length > ownMarks.length
        if (hasNestedChange) {
          parentLabels.set(
            liItem,
            `${isStaflidur ? 'Stafliður' : 'Töluliður'} ${getLiPoint(
              lidur,
              isStaflidur,
            )}, `,
          )
        }
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
        parentLabels.set(
          liItem,
          `${isStaflidur ? 'Stafliður' : 'Töluliður'} ${getLiPoint(
            lidur,
            isStaflidur,
          )}, `,
        )
        return
      }
      wholeItems.add(liItem)

      const isLiDeleted = newLiText === '' || newLiText === null
      const isLiAddition = oldLiText === '' || oldLiText === null

      const liLidur = isStaflidur ? '-liður' : 'töluliður'
      const liLidurPassive = isStaflidur ? '-lið' : '. tölulið'
      const liLidurShortened = isStaflidur ? '-liður' : '. tölul.'

      const lidurLabel = liItemHtml === '' ? liLidur.toLowerCase() : liLidur

      if (isLiDeleted) {
        liItemHtml = (liItemHtml +
          `${getLiPoint(lidur, isStaflidur)}${
            isStaflidur ? lidurLabel : '. ' + lidurLabel
          } fellur brott og breytist númer annarra liða til samræmis.`) as HTMLText

        returningArray.push(liItemHtml)
        liItemHtml = '' as HTMLText
      } else if (isLiAddition) {
        liItemHtml = (liItemHtml +
          `Á eftir ${getLiPoint(
            lidur - 1,
            isStaflidur,
          )}${liLidurPassive} kemur nýr liður svohljóðandi, og breytist númer annarra liða til samræmis: ${ownLiText}`) as HTMLText

        returningArray.push(liItemHtml, ...(nestedListHtml as HTMLText[]))
        liItemHtml = '' as HTMLText
      } else {
        liItemHtml = (liItemHtml +
          `${getLiPoint(
            lidur,
            isStaflidur,
          )}${liLidurShortened} orðast svo: ${ownLiText}`) as HTMLText

        returningArray.push(liItemHtml, ...(nestedListHtml as HTMLText[]))
        liItemHtml = '' as HTMLText
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

  let liHtml = '' as HTMLText
  if (type === 'lidur') {
    const items = formatListItemDiff(item)
    // A restated nested list is markup of its own, not a sentence
    liHtml = items
      .map((i) => (/^<(ol|ul)\b/.test(i) ? i : `<p>${i}</p>`))
      .join('') as HTMLText
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
    liHtml,
    newTextElement,
  }
}
