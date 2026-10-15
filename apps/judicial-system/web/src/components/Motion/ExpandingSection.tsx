import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { enterExitTransition } from './transitions'

interface Props {
  // Whether the block is on the page. Flipping it slides the block open or
  // closed; the children stay mounted until the closing animation is done.
  show: boolean
  // Animate the block open when it is already shown on first render. Off by
  // default: landing on a page should show what is there, not play it in.
  animateOnMount?: boolean
  className?: string
}

/**
 * A block that slides and fades open when shown and closed when hidden.
 *
 * Height and opacity run as one tween. Staggering them leaves the opacity
 * finishing on an already settled box, and the content visibly re-paints at
 * that moment.
 *
 * Clipping is only on while the block is opening or closing, and is driven
 * by React state rather than by motion's `transitionEnd`, so the style is
 * guaranteed to reach the DOM. Once open the block must not clip: a select
 * menu or a calendar inside it renders inline, and a clipping ancestor is
 * also the boundary a popper measures against, which flips a calendar
 * upwards.
 */
const ExpandingSection: FC<PropsWithChildren<Props>> = ({
  show,
  animateOnMount = false,
  className,
  children,
}) => (
  <AnimatePresence initial={animateOnMount}>
    {show && <ExpandingBlock className={className}>{children}</ExpandingBlock>}
  </AnimatePresence>
)

// Its own component so each opening starts clipped: the state has to belong
// to the mounted block, not to whatever renders it.
const ExpandingBlock: FC<PropsWithChildren<Pick<Props, 'className'>>> = ({
  className,
  children,
}) => {
  const [isAnimating, setIsAnimating] = useState(true)

  return (
    <motion.div
      className={className}
      style={{ overflow: isAnimating ? 'hidden' : 'visible' }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={enterExitTransition}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
    >
      {children}
    </motion.div>
  )
}

export default ExpandingSection
