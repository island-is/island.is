import type { FC, PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Box, Text } from '@island.is/island-ui/core'
import * as styles from '@island.is/judicial-system-web/src/components/Cards/IconCard/IconCard.css'
import FadeSwap from '@island.is/judicial-system-web/src/components/Motion/FadeSwap'

import {
  getEnteringItemStaggerIndices,
  getVerdictTimelineItemKey,
} from './VerdictTimelineBody.logic'

export type VerdictTimelineItemTone = 'default' | 'critical'

export interface VerdictTimelineItem {
  // Names a bullet whose text changes while it stays the same bullet, such as
  // the defendant's stance. Its new text then fades in where the old one was,
  // rather than one bullet closing while another opens.
  id?: string
  text: string
  tone?: VerdictTimelineItemTone
}

interface Props {
  // The line above the bullets. Left out by cards that title themselves, such
  // as the public prosecution reviewer's.
  eyebrow?: string
  items: VerdictTimelineItem[]
}

/**
 * The read-only body of a verdict timeline card: an eyebrow above a bullet
 * list. Shared by the public prosecution office card, which fills the eyebrow
 * with the kind of ruling and adds date pickers below the list, and the defence
 * card, which fills it with the defendant name and adds nothing.
 *
 * Items appearing after the first render animate in one after another, so a
 * newly registered date visibly lands in the list - whether it is appended or
 * takes the place of another item, as the appeal bullet does the stance bullet.
 * Which items those are is decided by getEnteringItemStaggerIndices. An item
 * with an id that changes its text swaps it in place instead.
 */
const VerdictTimelineBody: FC<PropsWithChildren<Props>> = (props) => {
  const { eyebrow, items, children } = props

  // The items shown by the previous render, or null before the first one.
  const previousKeysRef = useRef<ReadonlySet<string> | null>(null)

  useEffect(() => {
    previousKeysRef.current = new Set(items.map(getVerdictTimelineItemKey))
  })

  const staggerIndices = getEnteringItemStaggerIndices(
    previousKeysRef.current,
    items,
  )

  return (
    <Box className={styles.container}>
      {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
      <AnimatePresence initial={false}>
        {items.map((item, index) => {
          const staggerIndex = staggerIndices[index]
          const isNewItem = staggerIndex !== undefined
          const bullet = (
            <Text color={item.tone === 'critical' ? 'red600' : undefined}>
              {`• ${item.text}`}
            </Text>
          )

          return (
            <motion.div
              key={getVerdictTimelineItemKey(item)}
              initial={
                isNewItem
                  ? {
                      opacity: 0,
                      y: 20,
                      height: 0,
                    }
                  : false
              }
              animate={{
                opacity: 1,
                y: 0,
                height: 'auto',
              }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{
                delay: isNewItem ? staggerIndex * 0.2 : 0,
                duration: 0.3,
              }}
            >
              {item.id ? (
                <FadeSwap swapKey={item.text}>{bullet}</FadeSwap>
              ) : (
                bullet
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
      {children}
    </Box>
  )
}

export default VerdictTimelineBody
