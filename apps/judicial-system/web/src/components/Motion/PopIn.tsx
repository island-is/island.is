import type { FC, PropsWithChildren } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { enterExitTransition, instantTransition } from './transitions'

interface Props {
  // Whether the element is on the page. Flipping it pops the element in or
  // out; the children stay mounted until the leaving animation is done.
  show: boolean
}

/**
 * A small inline element, such as a tag, that fades and grows in when shown
 * and shrinks out when hidden.
 *
 * Unlike ExpandingSection it does not animate its size in the flow, so it
 * suits an element that sits beside others on a line rather than a block
 * that pushes content down.
 *
 * An element shown on the first render is not played in: landing on a page
 * should show what is there. For users who ask for reduced motion the
 * element changes state at once.
 */
const PopIn: FC<PropsWithChildren<Props>> = ({ show, children }) => {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.span
          style={{ display: 'inline-flex' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={reduceMotion ? instantTransition : enterExitTransition}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export default PopIn
