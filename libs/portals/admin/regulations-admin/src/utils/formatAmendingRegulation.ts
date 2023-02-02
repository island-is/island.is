import { asDiv, HTMLText } from '@island.is/regulations'
import qq from '@hugsmidjan/qj/qq'
import { RegDraftForm } from '../state/types'

// ----------------------------------------------------------------------
const PREFIX_AMENDING = 'Reglugerð um breytingu á reglugerð nr. '

// TODO: Bæta við brottfellingartitlum.
const PREFIX_REPEALING = 'Reglugerð um brottfellingu á reglugerð nr. ' // repealingTitleRe

const removeRegPrefix = (title: string) => {
  if (/^Reglugerð/.test(title)) {
    return title.replace(/^Reglugerð/, '')
  }
  return title
}

export const formatAmendingRegTitle = (draft: RegDraftForm) => {
  const impactArray = Object.values(draft.impacts)

  if (impactArray.length > 0) {
    const titleArray = impactArray
      .flat()
      .map((item) => `${item.name}${removeRegPrefix(item.regTitle)}`)

    return PREFIX_AMENDING + titleArray.join(' og ')
  }

  return PREFIX_AMENDING
}

// ----------------------------------------------------------------------

export const formatAmendingRegBody = (diff: HTMLText | string | undefined) => {
  if (!diff) {
    return []
  }

  const additionArray: HTMLText[] = []

  const diffString = diff as string
  const diffDiv = asDiv(diffString)
  let grein = 0
  let malsgrein = 0
  let changeGrein = 0

  qq('div > *', diffDiv).forEach((item) => {
    // Increment grein number on every article title
    if (item.classList.contains('article__title')) {
      grein++
      malsgrein = 0
    }

    let isMalsgrein = false
    let isGreinTitle = false
    let isTolulidur = false

    // Increment malsgrein number on every paragraph after article
    if (item.nodeName === 'P') {
      malsgrein++
      isMalsgrein = true
    }

    if (item.nodeName === 'H3') {
      isGreinTitle = true
    }

    if (item.nodeName === 'OL') {
      isTolulidur = true
    }

    const hasDeletion = !!item.querySelector('del')
    const hasInsert = !!item.querySelector('ins')

    if (hasDeletion || hasInsert) {
      changeGrein++
      const oldTextElement = item.cloneNode(true) as Element
      oldTextElement.querySelectorAll('ins').forEach((e) => e.remove())
      const oldText = oldTextElement.textContent

      const newTextElement = item.cloneNode(true) as Element
      newTextElement.querySelectorAll('del').forEach((e) => e.remove())
      const newText = newTextElement.textContent

      const isDeleted = newText === '' || newText === null

      let pushHtml = '' as HTMLText
      if (isDeleted) {
        if (isMalsgrein) {
          pushHtml = `<h3 class="article__title">${changeGrein}. gr.</h3><p>${malsgrein}. mgr. ${grein}. gr. reglugerðarinnar er eytt út</p>` as HTMLText
        } else if (isGreinTitle) {
          pushHtml = `<h3 class="article__title">${changeGrein}. gr.</h3><p>Titli ${grein}. gr. reglugerðarinnar er eytt út</p>` as HTMLText
        }
      } else {
        if (isGreinTitle) {
          pushHtml = `<h3 class="article__title">${changeGrein}. gr.</h3><p>Eftirfarandi breytingar verða á titli fyrir ${grein}. gr. reglugerðarinnar:</p><p>Í stað ${oldText} kemur ${newText}</p>` as HTMLText
        } else if (isMalsgrein) {
          pushHtml = `<h3 class="article__title">${changeGrein}. gr.</h3><p>Eftirfarandi breytingar verða á ${malsgrein}. mgr. ${grein}. gr. reglugerðarinnar:</p><p>Málsgreinin verður svohljóðandi: ${newText}</p>` as HTMLText
        }
      }
      additionArray.push(pushHtml)
    }
  })

  return additionArray
}
