/**
 * Ported from: libs/portals/admin/regulations-admin/src/utils/getDeletionOrAddition.ts
 *
 * Parses diff HTML elements containing <ins>/<del> tags and
 * determines whether each element is an addition, deletion, or modification.
 */
import qq from '@hugsmidjan/qj/qq'
import { HTMLText } from '@island.is/regulations'

export const getLiPoint = (num: number, isStaflidur: boolean) => {
  const charNum = num > 22 ? 23 : num - 1
  const bulletPoint = isStaflidur ? String.fromCharCode(97 + charNum) : num

  return bulletPoint
}

export const formatListItemDiff = (item: Element) => {
  let oldLiText = ''
  let newLiText = ''
  let liItemHtml = '' as HTMLText
  let lidur = 0
  const returningArray: HTMLText[] = []
  qq('ol > li', item).forEach((liItem) => {
    lidur++

    const liHasDeletion = !!liItem.querySelector('del')
    const liHasInsert = !!liItem.querySelector('ins')

    if (liHasDeletion || liHasInsert) {
      const oldLiElement = liItem.cloneNode(true) as Element
      oldLiElement.querySelectorAll('ins').forEach((e) => e.remove())
      oldLiText = oldLiElement.textContent || ''

      const newLiElement = liItem.cloneNode(true) as Element
      newLiElement.querySelectorAll('del').forEach((e) => e.remove())
      newLiText = newLiElement.textContent || ''

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

      const isStaflidur =
        liItem?.parentElement?.getAttribute('type')?.toLowerCase() === 'a'

      if (containsDirect) {
        liItemHtml = (liItemHtml + formatListItemDiff(liItem)) as HTMLText
      } else {
        liItemHtml = (liItemHtml +
          `${isStaflidur ? 'Stafliður' : 'Töluliður'} ${getLiPoint(
            lidur,
            isStaflidur,
          )}, `) as HTMLText
        formatListItemDiff(liItem)
        lidur = 0
        return
      }

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
          )}${liLidurPassive} kemur nýr liður svohljóðandi, og breytist númer annarra lið til samræmis: ${newLiText}`) as HTMLText

        returningArray.push(liItemHtml)
        liItemHtml = '' as HTMLText
      } else {
        liItemHtml = (liItemHtml +
          `${getLiPoint(
            lidur,
            isStaflidur,
          )}${liLidurShortened} orðast svo: ${newLiText}`) as HTMLText

        returningArray.push(liItemHtml)
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

  oldTextElement.querySelectorAll('ins').forEach((e) => e.remove())
  oldText = oldTextElement.textContent || ''

  newTextElement.querySelectorAll('del').forEach((e) => e.remove())
  newText = newTextElement.textContent || ''

  let liHtml = '' as HTMLText
  if (type === 'lidur') {
    liHtml = `<p>${formatListItemDiff(item).join('</p><p>')}</p>` as HTMLText
  } else {
    oldTextElement.querySelectorAll('ins').forEach((e) => e.remove())
    oldText = oldTextElement.textContent || ''

    newTextElement.querySelectorAll('del').forEach((e) => e.remove())

    if (type === 'greinTitle') {
      const tempElement = newTextElement

      const insElements = tempElement.querySelectorAll('ins')

      insElements.forEach((insElement) => {
        const content = insElement.textContent
        insElement.textContent = ` ${content}<br />`
      })

      const modifiedTextContent = tempElement?.textContent?.trim()

      const modContent = modifiedTextContent ?? ''
      const match = modContent.match(/^\d+\.\s*gr\.\s*(<br\s*\/?>)?$/)
      if (match) {
        newText = modContent
      } else {
        const parts = modContent.split(/^\d+\.\s*gr\.\s*/)
        newText = parts[1] ? parts[1] : modContent
      }
    } else {
      newText = newTextElement.textContent || ''
    }
  }

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
