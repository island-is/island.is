import { useMemo } from 'react'

import {
  HTMLText,
  Regulation,
  RegulationMaybeDiff,
} from '@island.is/regulations'
import { NamespaceGetter } from '@island.is/web/hooks'

type ItemType =
  | 'document' // Regulation, appendix, comments
  | 'section'
  | 'chapter'
  | 'subchapter'
  | 'article'

type IndexItem = {
  title: string
  id: string
  type: ItemType
}

type FlatIndex = Array<IndexItem>

export type IndexTree = Array<IndexItem & { subItems?: IndexTree }>
type IndexTreeItem = IndexTree[0]

// ---------------------------------------------------------------------------

const getSubitems = (item: IndexTreeItem): IndexTree => {
  if (!item.subItems) {
    item.subItems = []
  }
  return item.subItems
}

const levels: Record<ItemType, number> = {
  document: 1,
  section: 2,
  chapter: 3,
  subchapter: 4,
  article: 5,
} as const

const flatIndexToTree = (flatIndex: FlatIndex): IndexTree => {
  const tree: IndexTree = []
  const crumbs: IndexTree = []

  const handleItem = (item: IndexTreeItem): void => {
    const { title, id, type } = item
    const newItem: IndexTreeItem = { title, id, type }

    const lastCrumb = crumbs[crumbs.length - 1]

    if (!lastCrumb) {
      tree.push(newItem)
      crumbs.push(newItem)
      return
    }

    const lastLevel = levels[lastCrumb.type]
    const currentLevel = levels[type]

    if (currentLevel <= lastLevel) {
      // item is same level as lastLevel — lets go sibling
      crumbs.pop()
      handleItem(item)
      return
    }
    // item is higher/deeper level than lastLevel — lets go deeper
    const subItems = getSubitems(lastCrumb)
    subItems.push(newItem)
    crumbs.push(newItem)
    return
  }

  flatIndex.forEach(handleItem)

  return tree
}

// ---------------------------------------------------------------------------

const insertIds = (
  flatIndex: FlatIndex,
  html: HTMLText,
  idPrefix = '',
): HTMLText => {
  const DIVIDER = '__'
  const foundIds: Record<string, number> = {}
  return html.replace(
    // NOTE:
    // HTML parsing of HTML with Regexp is only tenable because
    // the regulation texts coming from the API are guaranteed to be
    // prettier-formatted and passed through a strict cleanup filter
    // which only passes through
    //  * explicitly allowed elements
    //  + with eplicitly allowed (and sorted!) atttributes
    //  * with explicitly allowed values.
    //
    // Do not try this at home.
    //
    / class="(section|chapter|subchapter|article)__title"\s*>(([^<]+)(?:.[^/][^]*?)?)<\/[hH]\d/g,
    (
      htmlSnippet: string,
      _type: string,
      longTitle: string,
      shortTitle: string,
    ) => {
      const type = _type as ItemType
      let id = idPrefix + shortTitle.toLowerCase().replace(/\s/g, '')
      if (!foundIds[id]) {
        foundIds[id] = 1
      } else {
        let count = foundIds[id] + 1
        // Re-increment the count in the astronomically unlikely caase
        // that an actual, "naturally occurring" header text
        // actually ended with the characters " __${count}"
        while (foundIds[id + DIVIDER + count]) count++

        const newId = id + DIVIDER + count
        foundIds[id] = count
        // prevent later collisions with the new ("avoided") id
        foundIds[newId] = 1
        id = newId
      }
      const title = longTitle.replace(/<[^]+?>/g, '').trim()

      // FWIW: The following HTML snippet
      //   <h3 class="article__title">1. gr. <em class="article__name">Helstu hugtök</em></h3>
      //
      // results in these variable values:
      //
      //   type: 'article',
      //   title: '1. gr. Helstu hugtök',
      //   id: '1.gr.',
      //
      flatIndex.push({
        title,
        type,
        id,
      })

      return ` id="${id}" ${htmlSnippet}`
    },
  ) as HTMLText
}

// ===========================================================================

type IndexerRet<Reg extends RegulationMaybeDiff> = {
  index?: IndexTree
  text: HTMLText
  appendixes: Reg['appendixes']
  comments: HTMLText
}

const useRegulationIndexer = <Reg extends RegulationMaybeDiff>(
  regulation: Reg,
  txt: NamespaceGetter<
    Partial<Record<'indexItem_regulation' | 'indexItem_comments', string>>
  >,
): IndexerRet<Reg> => {
  return useMemo(
    () => {
      if (regulation.showingDiff) {
        // Don't attempt to inject ids into a diffed regulation
        // because things can get very confusing in Diffland.
        // Let's just not.
        return {
          text: regulation.text,
          appendixes: regulation.appendixes,
          comments: regulation.comments,
        }
      }
      const flatIndex: FlatIndex = []

      if (regulation.appendixes.length) {
        flatIndex.push({
          title: txt('indexItem_regulation'),
          id: '',
          type: 'document',
        })
      }

      const text = insertIds(flatIndex, regulation.text)

      const appendixes = (regulation as Regulation).appendixes.map(
        ({ title, text }, i) => {
          const id = `v${i + 1}`
          flatIndex.push({
            title,
            id,
            type: 'document',
          })
          return {
            title,
            text,
            // // TODO: Enable Appendix deep-diving when we've resolved auto-opening
            // // the accordions when user clicks the index links
            // // Until then just render the top-level Appendix titles.
            // text: insertIds(flatIndex, text, id + '_'),
          }
        },
      )

      if (regulation.comments) {
        flatIndex.push({
          title: txt('indexItem_comments'),
          id: 'aths_ritstjora',
          type: 'document',
        })
      }

      const doRenderIndex = flatIndex.length > 5

      return {
        text,
        appendixes,
        comments: regulation.comments,
        index: doRenderIndex ? flatIndexToTree(flatIndex) : undefined,
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [regulation],
  )
}

export { useRegulationIndexer }
