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

export const formatAmendingRegTitle = (draft: RegDraftForm) => {
  const impactArray = Object.values(draft.impacts)

  if (impactArray.length > 0) {
    const titleArray = impactArray.flat()

    const amendingArray = titleArray.filter((item) => item.type === 'amend')
    const repealArray = titleArray.filter((item) => item.type === 'repeal')

    const amendingTitles = amendingArray.map(
      (item, i) =>
        `${i === 0 ? `${PREFIX_AMENDING}` : ''}${item.name.replace(
          /^0+/,
          '',
        )}${removeRegPrefix(item.regTitle)}`,
    )

    const repealTitles = repealArray.map(
      (item, i) =>
        `${i === 0 ? `${PREFIX_REPEALING}` : ''}${item.name.replace(
          /^0+/,
          '',
        )}${removeRegPrefix(item.regTitle)}`,
    )

    return PREFIX + [...amendingTitles, ...repealTitles].join(' og ')
  }

  return PREFIX
}

// ----------------------------------------------------------------------

export const formatAmendingRegBody = (
  regName: string,
  repeal?: boolean,
  diff?: HTMLText | string | undefined,
) => {
  if (repeal) {
    const text =
      `<p>Reglugerð nr. ${regName} ásamt síðari breytingum fellur brott</p>` as HTMLText
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

  groupedArticles.forEach((group) => {
    // Er allt inni í sub array 'deletion'?
    let articleTitle = ''
    const testGroup: {
      arr: HTMLText[]
      title: string
      isDeletion?: boolean
    } = {
      arr: [],
      title: '',
      isDeletion: undefined,
    }

    group.forEach((element) => {
      const {
        newText,
        oldText,
        isDeleted,
        isAddition,
        liHtml,
        newTextElement,
      } = getDeletionOrAddition(element)

      const regNameDisplay =
        regName && regName !== 'self'
          ? `reglugerðar nr. ${regName}`
          : 'reglugerðarinnar'
      let pushHtml = '' as HTMLText

      let isParagraph = false
      let isArticleTitle = false
      let isNumberList = false
      let isLetterList = false
      if (element.classList.contains('article__title')) {
        articleTitle = element.innerText
        testGroup.title = articleTitle
        isArticleTitle = true
        paragraph = 0 // Reset paragraph count for the new article
        // } else if (element.tagName.toLowerCase() === 'p') {
      } else if (element.nodeName === 'P') {
        paragraph++
        isParagraph = true
      } else if (element.nodeName === 'OL') {
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

      if (hasDeletion || hasInsert || isGildistokuGrein) {
        if (isGildistokuGrein) {
          pushHtml = `<p>${oldText}</p>` as HTMLText
        } else if (isDeleted) {
          // If deletion has never been false, everything is deleted, so it will stay true.
          if (testGroup.isDeletion !== false) {
            testGroup.isDeletion = true
          }
          if (isParagraph) {
            // Paragraph was deleted
            pushHtml =
              `<p>${paragraph}. mgr. ${articleTitle} ${regNameDisplay} fellur brott</p>` as HTMLText
          } else if (isArticleTitle) {
            // Title was deleted
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} fellur brott</p>` as HTMLText
          } else if (isLetterList || isNumberList) {
            // List was deleted
            pushHtml = `<p>${
              isLetterList ? 'Stafliðir' : 'Töluliðir'
            } eftir ${paragraph}. mgr. ${articleTitle} ${regNameDisplay} falla brott</p>` as HTMLText
          } else {
            // We don't know what you deleted, but there was a deletion, and here's the deletelog:
            pushHtml =
              `<p>Texti í ${articleTitle} ${regNameDisplay} fellur brott:</p><p>${oldText}</p>` as HTMLText
          }
        } else if (isAddition) {
          testGroup.isDeletion = false
          if (isParagraph) {
            // Paragraph was added
            pushHtml =
              paragraph > 1
                ? (`<p>Á eftir ${
                    paragraph - 1
                  }. mgr. ${articleTitle} ${regNameDisplay} kemur ný málsgrein sem orðast svo:</p><p>${newText}</p>` as HTMLText)
                : (`<p>1. mgr. ${articleTitle} ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText)
          } else if (isArticleTitle) {
            // Title was added
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

            pushHtml = `<p>${
              isLetterList ? 'Stafliðum' : 'Töluliðum'
            } eftir ${paragraph}. mgr. ${articleTitle} ${regNameDisplay} er bætt við:</p>${newLiTextBody}` as HTMLText
          } else {
            // We don't know what you added, but there was an addition, and here's the additionlog:
            pushHtml =
              `<p>Eftirfarandi texta ${regNameDisplay} var bætt við:</p><p>${newText}</p>` as HTMLText
          }
        } else {
          testGroup.isDeletion = false
          if (isArticleTitle) {
            // Title was changed
            pushHtml =
              `<p>Fyrirsögn ${articleTitle} ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText
          } else if (isParagraph) {
            // Paragraph was changed
            pushHtml =
              `<p>${paragraph}. mgr. ${articleTitle} ${regNameDisplay} orðast svo:</p><p>${newText}</p>` as HTMLText
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
        testGroup.isDeletion = false
      }
    })
    if (testGroup.isDeletion === true) {
      const articleTitleNumber = testGroup.title
      additionArray.push([
        `<p>${articleTitleNumber} fellur brott</p>` as HTMLText,
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
