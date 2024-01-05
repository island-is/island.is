import { asDiv, HTMLText } from '@island.is/regulations'
import qq from '@hugsmidjan/qj/qq'
import { GroupedDraftImpactForms, RegDraftForm } from '../state/types'
import flatten from 'lodash/flatten'

// ----------------------------------------------------------------------
const PREFIX = 'Reglugerð um '
const PREFIX_AMENDING = 'breytingu á reglugerð nr. '
const PREFIX_REPEALING = 'brottfellingu á reglugerð nr. '

const removeRegPrefix = (title: string) => {
  if (/^Reglugerð/.test(title)) {
    return title.replace(/^Reglugerð/, '')
  }
  return title
}

export const formatAmendingRegTitle = (draft: RegDraftForm) => {
  const impactArray = Object.values(draft.impacts)

  if (impactArray.length > 0) {
    const titleArray = impactArray.flat()

    const amendingArray = titleArray.filter((item) => item.type === 'amend')
    const repealArray = titleArray.filter((item) => item.type === 'repeal')

    const amendingTitles = amendingArray.map(
      (item, i) =>
        `${i === 0 ? `${PREFIX_AMENDING}` : ''} ${item.name}${removeRegPrefix(
          item.regTitle,
        )}`,
    )

    const repealTitles = repealArray.map(
      (item, i) =>
        `${i === 0 ? `${PREFIX_REPEALING}` : ''} ${item.name}${removeRegPrefix(
          item.regTitle,
        )}`,
    )

    return PREFIX + [...amendingTitles, ...repealTitles].join(' og ')
  }

  return PREFIX
}

// ----------------------------------------------------------------------

const getLiPoint = (num: number, isStaflidur: boolean) => {
  const charNum = num > 22 ? 23 : num - 1
  const bulletPoint = isStaflidur ? String.fromCharCode(97 + charNum) : num

  return bulletPoint
}

// List item recursion for nested lists
const formatListItemDiff = (item: Element) => {
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
        const needsMoreDrilling = e.nodeName === 'EM' || e.nodeName === 'STRONG'
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

      const liLidur = isStaflidur ? 'stafliður' : 'töluliður'
      const liLidurShortened = isStaflidur ? 'stafl.' : 'tölul.'

      const lidurMaybeCapitalized =
        liItemHtml === ''
          ? liLidur.charAt(0).toUpperCase() + liLidur.slice(1).toLowerCase()
          : liLidur

      if (isLiDeleted) {
        liItemHtml = (liItemHtml +
          `${lidurMaybeCapitalized} ${getLiPoint(
            lidur,
            isStaflidur,
          )}, ${oldLiText} fellur brott og breytist númer annarra liða til samræmis.`) as HTMLText

        // Finish up:
        returningArray.push(liItemHtml)
        liItemHtml = '' as HTMLText
      } else if (isLiAddition) {
        liItemHtml = (liItemHtml +
          `Á eftir ${getLiPoint(lidur - 1, isStaflidur)}. ${
            isStaflidur ? 'staflið' : 'tölulið'
          } kemur nýr liður svohljóðandi, og breytist númer annarra lið til samræmis: ${newLiText}`) as HTMLText

        // Finish up:
        returningArray.push(liItemHtml)
        liItemHtml = '' as HTMLText
      } else {
        liItemHtml = (liItemHtml +
          `${getLiPoint(
            lidur,
            isStaflidur,
          )}. ${liLidurShortened} orðast svo: ${newLiText}`) as HTMLText

        // Finish up:
        returningArray.push(liItemHtml)
        liItemHtml = '' as HTMLText
      }
    }
  })
  return returningArray
}

export const formatAmendingRegBody = (
  regName: string,
  repeal?: boolean,
  diff?: HTMLText | string | undefined,
) => {
  if (repeal) {
    return [
      `<p>Jafnframt fellur brott reglugerð nr. ${regName}</p>` as HTMLText,
    ]
  }

  if (!diff) {
    return []
  }

  const additionArray: HTMLText[] = []

  const diffString = diff as string
  const diffDiv = asDiv(diffString)
  let grein = 0
  let malsgrein = 0

  qq('div > *', diffDiv).forEach((item) => {
    // Increment grein number on every article title
    if (item.classList.contains('article__title')) {
      grein++
      malsgrein = 0
    }

    let isMalsgrein = false
    let isGreinTitle = false
    let isTolulidur = false
    let isStaflidur = false

    // Increment malsgrein number on every paragraph after article
    if (item.nodeName === 'P') {
      malsgrein++
      isMalsgrein = true
    }

    if (item.nodeName === 'H3') {
      isGreinTitle = true
    }

    if (item.nodeName === 'OL') {
      if (item.getAttribute('type')?.toLowerCase() === 'a') {
        isStaflidur = true
      } else {
        isTolulidur = true
      }
    }

    const hasDeletion = !!item.querySelector('del')
    const hasInsert = !!item.querySelector('ins')
    const isGildistokuGrein =
      isMalsgrein &&
      /(öðlast|tekur).*gildi|sett.*með.*(?:heimild|stoð)/.test(
        (item.textContent || '').toLowerCase(),
      )

    if (hasDeletion || hasInsert || isGildistokuGrein) {
      const oldTextElement = item.cloneNode(true) as Element
      const newTextElement = item.cloneNode(true) as Element
      let oldText = ''
      let newText = ''

      oldTextElement.querySelectorAll('ins').forEach((e) => e.remove())
      oldText = oldTextElement.textContent || ''

      newTextElement.querySelectorAll('del').forEach((e) => e.remove())
      newText = newTextElement.textContent || ''

      let liHtml = '' as HTMLText
      if (isStaflidur || isTolulidur) {
        liHtml = `<p>${formatListItemDiff(item).join(
          '</p><p>',
        )}</p>` as HTMLText
      } else {
        oldTextElement.querySelectorAll('ins').forEach((e) => e.remove())
        oldText = oldTextElement.textContent || ''

        newTextElement.querySelectorAll('del').forEach((e) => e.remove())

        if (isGreinTitle) {
          const tempElement = newTextElement

          // Select all <ins> elements within the temporary element
          const insElements = tempElement.querySelectorAll('ins')

          // Iterate through each <ins> element and insert a space before and after its content
          insElements.forEach((insElement) => {
            const content = insElement.textContent
            insElement.textContent = ` ${content}<br />`
          })

          // Retrieve the modified text content from the temporary element
          const modifiedTextContent = tempElement?.textContent?.trim()
          newText = modifiedTextContent ?? ''
        } else {
          newText = newTextElement.textContent || ''
        }
      }

      const isDeleted = newText === '' || newText === null
      const isAddition = oldText === '' || oldText === null

      const regNameDisplay =
        regName && regName !== 'self'
          ? `reglugerðar nr. ${regName}`
          : 'reglugerðarinnar'
      let pushHtml = '' as HTMLText

      if (isGildistokuGrein) {
        pushHtml = `<p>${oldText}</p>` as HTMLText
      } else if (isDeleted) {
        if (isMalsgrein) {
          // Paragraph was deleted
          pushHtml =
            `<p>${malsgrein}. mgr. ${grein}. gr. ${regNameDisplay} fellur brott</p>` as HTMLText
        } else if (isGreinTitle) {
          // Title was deleted
          pushHtml =
            `<p>Fyrirsögn ${grein}. gr. ${regNameDisplay} fellur brott</p>` as HTMLText
        } else if (isStaflidur || isTolulidur) {
          // List was deleted
          pushHtml = `<p>${
            isStaflidur ? 'Stafliðir' : 'Töluliðir'
          } eftir ${malsgrein}. mgr. ${grein}. gr. ${regNameDisplay} falla brott</p>` as HTMLText
        } else {
          // We don't know what you deleted, but there was a deletion, and here's the deletelog:
          pushHtml =
            `<p>Texti í ${grein}. gr. ${regNameDisplay} fellur brott:</p><p>${oldText}</p>` as HTMLText
        }
      } else if (isAddition) {
        if (isMalsgrein) {
          // Paragraph was added
          pushHtml =
            malsgrein > 1
              ? (`<p>Á eftir ${
                  malsgrein - 1
                }. mgr. ${grein}. gr. ${regNameDisplay} kemur ný málsgrein sem orðast svo:</p><p>${newText}</p>` as HTMLText)
              : (`<p>1. mgr. ${grein}. gr. ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText)
        } else if (isGreinTitle) {
          // Title was added
          pushHtml =
            `<p>Fyrirsögn ${grein}. gr. ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText
        } else if (isStaflidur || isTolulidur) {
          // List was added

          // Clean list addition:
          const liCleanArray: (string | null)[] = []
          newTextElement.querySelectorAll('ins').forEach((e) => {
            if (e.textContent) liCleanArray.push(e.textContent)
          })

          const newLiTextBody =
            liCleanArray.length > 0
              ? `<ol><li>${liCleanArray.join('</li><li>')}</li><ol>`
              : `<p>${newText}</p>`

          pushHtml = `<p>${
            isStaflidur ? 'Stafliðum' : 'Töluliðum'
          } eftir ${malsgrein}. mgr. ${grein}. gr. ${regNameDisplay} er bætt við:</p>${newLiTextBody}` as HTMLText
        } else {
          // We don't know what you added, but there was an addition, and here's the additionlog:
          pushHtml =
            `<p>Eftirfarandi texta ${regNameDisplay} var bætt við:</p><p>${newText}</p>` as HTMLText
        }
      } else {
        if (isGreinTitle) {
          // Title was changed
          pushHtml =
            `<p>Fyrirsögn ${grein}. gr. ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText
        } else if (isMalsgrein) {
          // Paragraph was changed
          pushHtml =
            `<p>${malsgrein}. mgr. ${grein}. gr. ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText
        } else if (isStaflidur || isTolulidur) {
          // List was changed
          pushHtml =
            `<p>${malsgrein}. mgr. ${grein}. gr. ${regNameDisplay} breytist:</p> ${liHtml}` as HTMLText
        } else {
          // We don't know what you changed, but there was a change, and here's the changelog:
          pushHtml =
            `<p>Eftirfarandi breytingar ${regNameDisplay} áttu sér stað:</p><p>${
              oldText ? `Í stað ${oldText} kemur ` : ''
            }${newText}</p>` as HTMLText
        }
      }
      additionArray.push(pushHtml)
    }
  })

  return additionArray
}

export const formatAmendingBodyWithArticlePrefix = (
  impactsArray: GroupedDraftImpactForms,
) => {
  const draftImpactLength = Object.entries(impactsArray).length

  const impactAdditionArray = Object.entries(impactsArray).map(
    ([key, impacts]) => {
      const impactArray = impacts.map((item, i) =>
        formatAmendingRegBody(
          draftImpactLength > 1 ? item.name : '',
          item.type === 'repeal',
          item.type === 'amend' ? item.diff?.value : undefined,
        ),
      )
      const flatArray = flatten(impactArray)
      return flatArray
    },
  )

  const additions = flatten(impactAdditionArray)

  const prependString = additions.map(
    (item, i) =>
      `<h3 class="article__title">${i + 1}. gr.</h3>${item}` as HTMLText,
  )

  return prependString
}
