import type { UniqueIdentifier } from '@dnd-kit/core'

import type { MockBulkCase } from './mockData'

export type ListId = 'staging' | 'source'

export type CaseLists = {
  staging: MockBulkCase[]
  source: MockBulkCase[]
}

export const LIST_LABELS: Record<ListId, string> = {
  staging: 'Mál til að ljúka',
  source: 'Mál í dómsuppkvaðningu',
}

/** Icelandic list: "A", "A og B", "A, B og C". */
export const formatIcelandicList = (items: string[]): string => {
  if (items.length === 0) {
    return ''
  }

  if (items.length === 1) {
    return items[0]
  }

  if (items.length === 2) {
    return `${items[0]} og ${items[1]}`
  }

  return `${items.slice(0, -1).join(', ')} og ${items[items.length - 1]}`
}

export const formatCaseNumberList = (cases: MockBulkCase[]): string =>
  formatIcelandicList(cases.map((c) => c.caseNumbers[0]))

/** Dative: "í 1 máli" / "í 2 málum". */
export const formatCaseCountDative = (count: number): string =>
  `${count} ${count === 1 ? 'máli' : 'málum'}`

export const getStagingEmptyMessage = (
  hasSelectableSourceCases: boolean,
): string =>
  hasSelectableSourceCases
    ? 'Engin mál valin – smelltu á mál eða dragðu þau hingað'
    : 'Engin mál tilbúin – staðfesta þarf dóm eða úrskurð áður en hægt er að ljúka máli'

export const findListId = (
  id: UniqueIdentifier,
  stagingCases: MockBulkCase[],
  sourceCases: MockBulkCase[],
): ListId | undefined => {
  if (id === 'staging' || id === 'source') {
    return id
  }

  if (stagingCases.some((c) => c.id === id)) {
    return 'staging'
  }

  if (sourceCases.some((c) => c.id === id)) {
    return 'source'
  }

  return undefined
}

export const moveCaseInLists = (
  prev: CaseLists,
  caseRow: MockBulkCase,
  from: ListId,
  to: ListId,
): CaseLists => {
  if (from === to) {
    return prev
  }

  if (to === 'staging' && !caseRow.canComplete) {
    return prev
  }

  return {
    ...prev,
    [from]: prev[from].filter((c) => c.id !== caseRow.id),
    [to]: [...prev[to], caseRow],
  }
}

export const transferCaseAcrossLists = (
  prev: CaseLists,
  activeId: string,
  overId: string,
): { next: CaseLists; didTransfer: boolean } => {
  const activeList = findListId(activeId, prev.staging, prev.source)
  const overList = findListId(overId, prev.staging, prev.source)

  if (!activeList || !overList || activeList === overList) {
    return { next: prev, didTransfer: false }
  }

  const activeItems = prev[activeList]
  const overItems = prev[overList]
  const activeIndex = activeItems.findIndex((c) => c.id === activeId)

  if (activeIndex < 0) {
    return { next: prev, didTransfer: false }
  }

  const moving = activeItems[activeIndex]

  if (overList === 'staging' && !moving.canComplete) {
    return { next: prev, didTransfer: false }
  }

  if (overItems.some((c) => c.id === activeId)) {
    return { next: prev, didTransfer: false }
  }

  const overIndex =
    overId === overList
      ? overItems.length
      : overItems.findIndex((c) => c.id === overId)

  const insertIndex = overIndex < 0 ? overItems.length : overIndex

  return {
    didTransfer: true,
    next: {
      ...prev,
      [activeList]: activeItems.filter((c) => c.id !== activeId),
      [overList]: [
        ...overItems.slice(0, insertIndex),
        moving,
        ...overItems.slice(insertIndex),
      ],
    },
  }
}

export const restoreSourceOrder = (
  prev: CaseLists,
  canonicalOrder: MockBulkCase[],
): CaseLists => {
  const combined = [...prev.source, ...prev.staging]

  return {
    staging: [],
    source: canonicalOrder.filter((mock) =>
      combined.some((item) => item.id === mock.id),
    ),
  }
}
