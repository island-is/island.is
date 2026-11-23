import type { VerdictTimelineItem } from './VerdictTimelineBody'

/**
 * What names an item across renders: its id when it has one, its text
 * otherwise. An item with an id keeps its place while its text changes.
 */
export const getVerdictTimelineItemKey = (item: VerdictTimelineItem): string =>
  item.id ?? item.text

/**
 * Decides which items of a verdict timeline should animate in, and in what
 * order, given the items the previous render showed.
 *
 * An item is entering when the previous render did not show it, whether it was
 * appended or replaced another item in place - the appeal bullet taking the
 * stance bullet's place, for instance. An item with an id that was already
 * shown is not entering when its text changes: it swaps its text in place.
 * Entering items are staggered in the order they appear in the list.
 *
 * Returns one entry per item: its stagger index if it is entering, `undefined`
 * otherwise. Nothing enters before the first render has happened, which is
 * signalled by `previousKeys` being `null`.
 */
export const getEnteringItemStaggerIndices = (
  previousKeys: ReadonlySet<string> | null,
  items: VerdictTimelineItem[],
): (number | undefined)[] => {
  if (previousKeys === null) {
    return items.map(() => undefined)
  }

  let enteringCount = 0

  return items.map((item) =>
    previousKeys.has(getVerdictTimelineItemKey(item))
      ? undefined
      : enteringCount++,
  )
}
