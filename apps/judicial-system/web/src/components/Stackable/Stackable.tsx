import type { FC, ReactNode } from 'react'
import { isValidElement, useId, useLayoutEffect, useRef, useState } from 'react'
import flattenChildren from 'react-keyed-flatten-children'
import cn from 'classnames'
import type { Transition } from 'motion/react'
import { motion, useReducedMotion } from 'motion/react'

import { Button } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './Stackable.css'

/** How far each item behind the top one is pushed down, in px. */
const PEEK = 12
/** How much narrower each item behind the top one is, per level. */
const SHRINK = 0.03
/** Per-item stagger when expanding or collapsing, in seconds. */
const STAGGER = 0.03

const transition: Transition = {
  duration: 0.36,
  ease: [0.2, 0.8, 0.2, 1],
}

const opacityTransition: Transition = { duration: 0.24, ease: 'easeInOut' }

const noTransition: Transition = { duration: 0 }

interface Props {
  children: ReactNode
  /**
   * How many items peek out beneath the top item while collapsed.
   * @default 2
   */
  visibleBehind?: number
  /**
   * Space between items when expanded, as a theme spacing step.
   * @default 2
   */
  space?: Exclude<keyof typeof theme.spacing, 'auto'>
  /**
   * Label of the toggle button while collapsed.
   * @default 'Sýna allt'
   */
  expandLabel?: string
  /**
   * Label of the toggle button while expanded.
   * @default 'Stafla'
   */
  collapseLabel?: string
  /** Whether the items are expanded. Makes the component controlled. */
  expanded?: boolean
  /**
   * Initial expanded state when uncontrolled.
   * @default false
   */
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

const isSameHeights = (a: number[], b: number[]) =>
  a.length === b.length && a.every((height, index) => height === b[index])

/**
 * Piles any number of children into a single iOS-notification-style stack.
 * The first child is fully visible, the next few peek out underneath, and
 * the rest are hidden. Clicking the pile or the toggle button fans the
 * children out into a normal vertical list, and the button collapses them
 * again.
 *
 * Every child is measured and positioned absolutely, so expanding and
 * collapsing only animates transforms and heights and nothing remounts.
 * While collapsed the pile is a single expand target, so interactive content
 * inside the children is reachable once expanded.
 */
const Stackable: FC<Props> = ({
  children,
  visibleBehind = 2,
  space = 2,
  expandLabel = 'Sýna allt',
  collapseLabel = 'Stafla',
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
}) => {
  const reduceMotion = useReducedMotion()
  const contentId = `stackable-${useId().replace(/\W/g, '')}`
  // Flattens arrays and fragments so each rendered element is its own item.
  const items = flattenChildren(children)
  const count = items.length
  const itemKeys = items.map((child, index) =>
    isValidElement(child) ? child.key ?? index : index,
  )
  // Replacing a keyed child with another keyed child keeps `count` the same
  // but mounts a new wrapper, so the keys are tracked too and the measuring
  // effect can attach to the replacement.
  const itemKeySignature = itemKeys.join('\u0000')

  const isControlled = expandedProp !== undefined
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const expanded = isControlled ? expandedProp : internalExpanded
  // Animations are enabled only after the first user toggle, so the initial
  // render (and any re-measure, e.g. after fonts load) snaps into place
  // instead of animating.
  const [hasToggled, setHasToggled] = useState(false)
  const animate = hasToggled && !reduceMotion

  const [heights, setHeights] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Measure each item's natural height so every item can be positioned
  // absolutely and slide between its piled and expanded positions without
  // ever remounting. Re-measures on resize.
  useLayoutEffect(() => {
    const elements = itemRefs.current.slice(0, count)
    const measure = () => {
      const next = elements.map((el) => el?.offsetHeight ?? 0)
      setHeights((prev) => (isSameHeights(prev, next) ? prev : next))
    }

    measure()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(measure)
    elements.forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [count, itemKeySignature])

  if (count === 0) {
    return null
  }

  // Nothing to pile, so render the child as-is and skip the measuring.
  if (count === 1) {
    return items[0]
  }

  const setExpanded = (next: boolean) => {
    setHasToggled(true)

    if (!isControlled) {
      setInternalExpanded(next)
    }

    onExpandedChange?.(next)
  }

  const behindCount = Math.max(0, Math.min(visibleBehind, count - 1))
  const gap = theme.spacing[space]
  const topHeight = heights[0] ?? 0

  const expandedOffsets = items.reduce<number[]>((offsets, _, index) => {
    offsets.push(
      index === 0 ? 0 : offsets[index - 1] + (heights[index - 1] ?? 0) + gap,
    )
    return offsets
  }, [])
  const expandedHeight = expandedOffsets[count - 1] + (heights[count - 1] ?? 0)
  const collapsedHeight = topHeight + behindCount * PEEK

  return (
    <div>
      <motion.div
        id={contentId}
        className={cn(styles.root, {
          [styles.measuring]: heights.length === 0,
        })}
        initial={false}
        animate={{ height: expanded ? expandedHeight : collapsedHeight }}
        transition={animate ? transition : noTransition}
      >
        {items.map((child, index) => {
          // While collapsed, items beyond the visible peekers hide under the
          // last visible one so they can slide out from there when expanding.
          const level = Math.min(index, behindCount)
          const tuckedAway = !expanded && index > behindCount
          const hidden = !expanded && index > 0
          const delay = animate
            ? (expanded ? index : count - 1 - index) * STAGGER
            : 0

          return (
            <motion.div
              key={itemKeys[index]}
              className={styles.item}
              aria-hidden={hidden ? true : undefined}
              inert={hidden ? true : undefined}
              style={{ zIndex: count - index }}
              initial={false}
              animate={{
                y: expanded ? expandedOffsets[index] : level * PEEK,
                scale: expanded ? 1 : 1 - level * SHRINK,
                // Piled items adopt the top item's height so only their
                // bottom edge peeks out. Expanded items use their own height.
                height: expanded ? heights[index] : topHeight,
                opacity: tuckedAway ? 0 : 1,
              }}
              transition={
                animate
                  ? {
                      ...transition,
                      delay,
                      opacity: { ...opacityTransition, delay },
                    }
                  : noTransition
              }
            >
              <div
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
              >
                {child}
              </div>
            </motion.div>
          )
        })}

        {/*
         * Pointer users can click anywhere on the collapsed pile to expand it.
         * Keyboard and assistive-technology users get the toggle button below,
         * so this overlay stays out of the tab order and the accessibility tree.
         */}
        {!expanded && (
          <button
            type="button"
            className={styles.expandOverlay}
            style={{ zIndex: count + 1 }}
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setExpanded(true)}
          />
        )}
      </motion.div>

      {/*
       * The toggle sits below the pile in normal flow, so it rides along as
       * the pile's height animates.
       */}
      <div className={styles.toggle}>
        <Button
          variant="text"
          size="small"
          icon={expanded ? 'chevronUp' : 'chevronDown'}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={contentId}
        >
          {expanded ? collapseLabel : expandLabel}
        </Button>
      </div>
    </div>
  )
}

export default Stackable
