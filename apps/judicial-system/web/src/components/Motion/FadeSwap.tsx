import type { FC, PropsWithChildren } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { instantTransition, swapTransition } from './transitions'

interface Props {
  // Names what the block shows. A new value fades the old content out and
  // the new content in; the same value updates the content in place.
  swapKey: string
}

/**
 * A block whose content gives way to other content in the same place, such
 * as a heading that changes with what a form is doing.
 *
 * The old content leaves before the new arrives, so the two never take up
 * room at the same time and nothing around the block moves.
 *
 * Content shown on the first render is not played in: landing on a page
 * should show what is there. For users who ask for reduced motion the
 * content changes at once.
 */
const FadeSwap: FC<PropsWithChildren<Props>> = ({ swapKey, children }) => {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={reduceMotion ? instantTransition : swapTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default FadeSwap
