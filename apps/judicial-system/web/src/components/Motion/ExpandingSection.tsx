import type { FC, PropsWithChildren } from 'react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { enterExitTransition, instantTransition } from './transitions'

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
 *
 * For users who ask for reduced motion the block changes state at once.
 * Motion's own reduced-motion setting leaves a height tween running, so the
 * choice is made here.
 */
const ExpandingSection: FC<PropsWithChildren<Props>> = ({
  show,
  animateOnMount = false,
  className,
  children,
}) => {
  // Whether a block mounting now plays open. On the first render only when
  // asked to: AnimatePresence skips the entrance otherwise, and a block that
  // never animates never reports an animation complete. A block mounting on
  // any later render is an opening and always plays.
  const isFirstRender = useRef(true)

  useEffect(() => {
    isFirstRender.current = false
  }, [])

  return (
    <AnimatePresence initial={animateOnMount}>
      {show && (
        <ExpandingBlock
          className={className}
          animatesIn={animateOnMount || !isFirstRender.current}
        >
          {children}
        </ExpandingBlock>
      )}
    </AnimatePresence>
  )
}

interface BlockProps extends Pick<Props, 'className'> {
  // Whether the block animates open on mount, and so starts out clipped.
  animatesIn: boolean
}

// Its own component so each opening starts clipped: the state has to belong
// to the mounted block, not to whatever renders it.
const ExpandingBlock: FC<PropsWithChildren<BlockProps>> = ({
  className,
  animatesIn,
  children,
}) => {
  const [isAnimating, setIsAnimating] = useState(animatesIn)
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={{ overflow: isAnimating ? 'hidden' : 'visible' }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={reduceMotion ? instantTransition : enterExitTransition}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
    >
      {children}
    </motion.div>
  )
}

export default ExpandingSection
