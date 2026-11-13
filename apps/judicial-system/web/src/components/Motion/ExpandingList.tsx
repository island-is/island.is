import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'

import { ExpandingBlock } from './ExpandingSection'

interface Props<T> {
  items: T[]
  // Names an item across renders. An item whose key is new slides open, and
  // an item whose key is gone slides closed, so the key has to stay with the
  // item while others are added or removed around it, not with its position.
  getKey: (item: T, index: number) => string
  renderItem: (item: T, index: number) => ReactNode
  // Animate the items open when they are already on the page on first
  // render. Off by default: landing on a page should show what is there, not
  // play it in.
  animateOnMount?: boolean
}

/**
 * A list whose items slide and fade open when added and closed when removed,
 * each the way an ExpandingSection does.
 *
 * The items share one AnimatePresence, which is what lets a removed item
 * play out: an item that wraps its own would be unmounted along with it.
 *
 * Items present on the first render are shown as they are. For users who ask
 * for reduced motion the list changes at once.
 */
const ExpandingList = <T,>({
  items,
  getKey,
  renderItem,
  animateOnMount = false,
}: Props<T>) => {
  // Whether an item rendering now will animate open, and so should start
  // clipped. An item on the first render only animates when animateOnMount
  // asks for it; an item added on a later render always does.
  const isFirstRender = useRef(true)

  useEffect(() => {
    isFirstRender.current = false
  }, [])

  return (
    <AnimatePresence initial={animateOnMount}>
      {items.map((item, index) => (
        <ExpandingBlock
          key={getKey(item, index)}
          animatesIn={animateOnMount || !isFirstRender.current}
        >
          {renderItem(item, index)}
        </ExpandingBlock>
      ))}
    </AnimatePresence>
  )
}

export default ExpandingList
