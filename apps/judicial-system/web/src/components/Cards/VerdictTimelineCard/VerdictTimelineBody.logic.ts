import type { VerdictTimelineItem } from './VerdictTimelineBody'

/**
 * Decides which items of a verdict timeline should animate in, and in what
 * order, given the items the previous render showed.
 *
 * An item is entering when the previous render did not show it, whether it was
 * appended or replaced another item in place - the appeal bullet taking the
 * stance bullet's place, for instance. Entering items are staggered in the order
 * they appear in the list.
 *
 * Returns one entry per item: its stagger index if it is entering, `undefined`
 * otherwise. Nothing enters before the first render has happened, which is
 * signalled by `previousTexts` being `null`.
 */
export const getEnteringItemStaggerIndices = (
  previousTexts: ReadonlySet<string> | null,
  items: VerdictTimelineItem[],
): (number | undefined)[] => {
  if (previousTexts === null) {
    return items.map(() => undefined)
  }

  let enteringCount = 0

  return items.map((item) =>
    previousTexts.has(item.text) ? undefined : enteringCount++,
  )
}
