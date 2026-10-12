import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import { motion } from 'motion/react'

/**
 * A block that slides and fades in when mounted and out when removed. Meant
 * to be rendered as a direct child of an `AnimatePresence`, which is what
 * keeps it in the tree for the exit.
 *
 * Height and opacity run as one tween. Staggering them, as the district
 * court's Completed screen does, leaves the opacity finishing on an already
 * settled box, and the content visibly re-paints at that moment.
 *
 * Clipping is only on while the box is opening or closing, and is driven by
 * React state rather than by motion's `transitionEnd`, so the style is
 * guaranteed to reach the DOM. Once open the wrapper must not clip: the
 * select menu and the calendar render inline, and a clipping ancestor is
 * also the boundary the calendar's popper measures against, which is what
 * made it flip upwards.
 */
const ExpandingSection: FC<PropsWithChildren> = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(true)

  return (
    <motion.div
      style={{ overflow: isAnimating ? 'hidden' : 'visible' }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
    >
      {children}
    </motion.div>
  )
}

export default ExpandingSection
