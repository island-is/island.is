import { asDiv, HTMLText } from '@island.is/regulations'
import { GroupedDraftImpactForms, RegDraftForm } from '../state/types'
import flatten from 'lodash/flatten'
import { groupElementsByArticleTitleFromDiv } from './groupByArticleTitle'
import { getDeletionOrAddition } from './getDeletionOrAddition'

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

const removeRegNamePrefix = (name: string) => {
  if (/^0+/.test(name)) {
    return name.replace(/^0+/, '')
  }
  return name
}

export const formatAmendingRegTitle = (draft: RegDraftForm) => {
  const impactArray = Object.values(draft.impacts)

  if (impactArray.length > 0) {
    const titleArray = impactArray.flat()

    const amendingArray = titleArray.filter((item) => item.type === 'amend')
    const repealArray = titleArray.filter((item) => item.type === 'repeal')

    const amendingTitles = amendingArray.map(
      (item, i) =>
        `${i === 0 ? `${PREFIX_AMENDING}` : ''}${removeRegNamePrefix(
          item.name,
        )} ${removeRegPrefix(item.regTitle)}`,
    )

    const repealTitles = repealArray.map(
      (item, i) =>
        `${i === 0 ? `${PREFIX_REPEALING}` : ''}${removeRegNamePrefix(
          item.name,
        )} ${removeRegPrefix(item.regTitle)}`,
    )

    return (
      PREFIX +
      [...amendingTitles, ...repealTitles].join(' og ').replace(/ +(?= )/g, '')
    )
  }

  return PREFIX
}

// ----------------------------------------------------------------------

export const formatAmendingRegBody = (
  name: string,
  repeal?: boolean,
  diff?: HTMLText | string | undefined,
  regTitle?: string,
) => {
  const regName = removeRegNamePrefix(name)
  if (repeal) {
    const title = regTitle ? regTitle.replace(/^reglugerð\s*/i, '') + ' ' : ''
    const text = `<p>Reglugerð nr. ${regName} ${title.replace(
      /\.$/,
      '',
    )}fellur brott.</p>` as HTMLText
    const gildistaka =
      `<p>Reglugerð þessi er sett með heimild í [].</p><p>Reglugerðin öðlast þegar gildi</p>` as HTMLText
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

  groupedArticles.forEach((group, i) => {
    // Get grouped article index to get name of previous grein for addition text.
    let articleTitle = ''
    const testGroup: {
      arr: HTMLText[]
      original?: HTMLText[]
      title: string
      isDeletion?: boolean
      isAddition?: boolean
    } = {
      arr: [],
      original: [],
      title: '',
      isDeletion: undefined,
      isAddition: undefined,
    }

    const regNameDisplay =
      regName && regName !== 'self'
        ? `reglugerðar nr. ${regName}`
        : 'reglugerðarinnar'

    group.forEach((element) => {
      let pushHtml = '' as HTMLText

      let isParagraph = false
      let isArticleTitle = false
      let isNumberList = false
      let isLetterList = false
      if (element.classList.contains('article__title')) {
        const clone = element.cloneNode(true)

        if (clone instanceof Element) {
          const emElement = clone.querySelector('em')
          if (emElement) {
            emElement.parentNode?.removeChild(emElement)
          }

          const textContent = clone.textContent?.trim() ?? ''

          articleTitle = textContent
        } else {
          articleTitle = element.innerText
        }
        testGroup.title = articleTitle
        isArticleTitle = true
        paragraph = 0 // Reset paragraph count for the new article
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
        isParagraph &&
        /(öðlast|tekur).*gildi|sett.*með.*(?:heimild|stoð)/.test(
          (element.textContent || '').toLowerCase(),
        )

      const elementType =
        isLetterList || isNumberList
          ? 'lidur'
          : isArticleTitle
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
          // If deletion has never been false, everything is deleted, so it will stay true.
          if (testGroup.isDeletion !== false) {
            testGroup.isDeletion = true
          }
          if (isParagraph) {
            // Paragraph was deleted
            pushHtml =
              `<p>${paragraph}. mgr. ${articleTitle} ${regNameDisplay} fellur brott.</p>` as HTMLText
          } else if (isArticleTitle) {
            // Title was deleted
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} fellur brott.</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            // List was deleted
            pushHtml = `<p>${
              isLetterList ? 'Stafliðir' : 'Töluliðir'
            } eftir ${paragraph}. mgr. ${articleTitle} ${regNameDisplay} falla brott.</p>` as HTMLText
          } else {
            // We don't know what you deleted, but there was a deletion, and here's the deletelog:
            pushHtml =
              `<p>Texti í ${articleTitle} ${regNameDisplay} fellur brott:</p><p>${oldText}</p>` as HTMLText
          }
        } else if (isAddition) {
          testGroup.isDeletion = false
          // If addition has never been false, everything is addition, so it will stay true.
          if (testGroup.isAddition !== false) {
            testGroup.isAddition = true
          }
          if (isParagraph) {
            // Paragraph was added
            testGroup.original?.push(`<p>${newText}</p>` as HTMLText)
            pushHtml =
              paragraph > 1
                ? (`<p>Á eftir ${
                    paragraph - 1
                  }. mgr. ${articleTitle} ${regNameDisplay} kemur ný málsgrein sem orðast svo:</p><p>${newText}</p>` as HTMLText)
                : (`<p>1. mgr. ${articleTitle} ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText)
          } else if (isArticleTitle) {
            // Title was added
            testGroup.original?.push(`<p>${newText}</p>` as HTMLText)
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
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

            testGroup.original?.push(newLiTextBody as HTMLText)
            pushHtml = `<p>${
              isLetterList ? 'Stafliðum' : 'Töluliðum'
            } eftir ${paragraph}. mgr. ${articleTitle} ${regNameDisplay} er bætt við:</p>${newLiTextBody}` as HTMLText
          } else {
            // We don't know what you added, but there was an addition, and here's the additionlog:
            testGroup.original?.push(`<p>${newText}</p>` as HTMLText)
            pushHtml =
              `<p>Eftirfarandi texta ${regNameDisplay} var bætt við:</p><p>${newText}</p>` as HTMLText
          }
        } else {
          // Change detected. Not additon, not deletion.
          testGroup.isDeletion = false
          testGroup.isAddition = false
          if (isArticleTitle) {
            // Title was changed
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} breytist og orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isParagraph) {
            // Paragraph was changed
            pushHtml =
              `<p>${paragraph}. mgr. ${articleTitle} ${regNameDisplay} breytist og orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            // List was changed
            pushHtml =
              `<p>${paragraph}. mgr. ${articleTitle} ${regNameDisplay} breytist:</p> ${liHtml}` as HTMLText
          } else {
            // We don't know what you changed, but there was a change, and here's the changelog:
            pushHtml =
              `<p>Eftirfarandi breytingar ${regNameDisplay} áttu sér stað:</p><p>${
                oldText ? `Í stað ${oldText} kemur ` : ''
              }${newText}</p>` as HTMLText
          }
        }
        testGroup.arr.push(pushHtml)
      } else {
        // Change detected. Not additon, not deletion.
        testGroup.isDeletion = false
        testGroup.isAddition = false
      }
    })
    if (testGroup.isDeletion === true) {
      const articleTitleNumber = testGroup.title
      additionArray.push([
        `<p>${articleTitleNumber} ${regNameDisplay} fellur brott.</p>` as HTMLText,
      ])
    } else if (testGroup.isAddition === true) {
      let prevArticleTitle = ''
      const prevArticle = groupedArticles?.[i - 1]
      if (prevArticle.length > 0) {
        prevArticleTitle = prevArticle[0]?.innerText
      }
      const articleTitleNumber = testGroup.title
      const originalTextArray = testGroup.original?.length
        ? flatten(testGroup.original)
        : []
      additionArray.push([
        `<p>Á eftir ${prevArticleTitle} ${regNameDisplay} kemur ný grein, ${articleTitleNumber}, ásamt fyrirsögn, svohljóðandi: ${
          originalTextArray ? testGroup.original?.join('') : ''
        }` as HTMLText,
      ])
    } else {
      additionArray.push(testGroup.arr)
    }
  })

  return additionArray.flat()
}

export const formatAmendingBodyWithArticlePrefix = (
  impactsArray: GroupedDraftImpactForms,
) => {
  const draftImpactLength = Object.entries(impactsArray).length

  const impactAdditionArray = Object.entries(impactsArray).map(
    ([key, impacts]) => {
      const impactArray = impacts.map((item, i) =>
        formatAmendingRegBody(
          item.type === 'repeal' || draftImpactLength > 1 ? item.name : '',
          item.type === 'repeal',
          item.type === 'amend' ? item.diff?.value : undefined,
          item.regTitle,
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
