import { HTMLText } from '@hugsmidjan/regulations-editor/types'
import { Regulation, RegulationMaybeDiff } from '@island.is/regulations/web'
import { NamespaceGetter } from '@island.is/web/hooks'
import { useMemo } from 'react'

type ItemType =
  | 'document'
  | /* Regulation, appendix, comments  */ 'section'
  | 'chapter'
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
  article: 4,
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

const idPrefixes: Record<ItemType, string> = {
  document: '',
  section: 'hl',
  chapter: 'k',
  article: 'gr',
}

const insertIds = (
  flatIndex: FlatIndex,
  html: HTMLText,
  idPrefix: string,
): HTMLText => {
  const count: Record<ItemType, number> = {
    document: 0, // not used, but hey...
    section: 0,
    chapter: 0,
    article: 0,
  }

  return html.replace(
    / class="(section|chapter|article)__title"\s*>([^]+?)<\/h\d/g,
    (htmlSnippet: string, _type: string, title: string) => {
      const type = _type as ItemType
      count[type] += 1
      const id = idPrefix + idPrefixes[type] + count[type]
      flatIndex.push({
        title: title.replace(/<[^]+?>/g, '').trim(),
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

function useRegulationIndexer<Reg extends RegulationMaybeDiff>(
  regulation: Reg,
  txt: NamespaceGetter<
    Partial<Record<'indexItem_regulation' | 'indexItem_comments', string>>
  >,
): IndexerRet<Reg> {
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

      const text = insertIds(flatIndex, regulation.text, '')

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
