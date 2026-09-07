import type { FC, PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Box, Text } from '@island.is/island-ui/core'
import * as styles from '@island.is/judicial-system-web/src/components/Cards/IconCard/IconCard.css'

import { getEnteringItemStaggerIndices } from './VerdictTimelineBody.logic'

export type VerdictTimelineItemTone = 'default' | 'critical'

export interface VerdictTimelineItem {
  text: string
  tone?: VerdictTimelineItemTone
}

interface Props {
  eyebrow: string
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
 * Which items those are is decided by getEnteringItemStaggerIndices.
 */
const VerdictTimelineBody: FC<PropsWithChildren<Props>> = (props) => {
  const { eyebrow, items, children } = props

  // The texts shown by the previous render, or null before the first one. The
  // text doubles as the item's identity, as it already does for its key.
  const previousTextsRef = useRef<ReadonlySet<string> | null>(null)

  useEffect(() => {
    previousTextsRef.current = new Set(items.map((item) => item.text))
  })

  const staggerIndices = getEnteringItemStaggerIndices(
    previousTextsRef.current,
    items,
  )

  return (
    <Box className={styles.container}>
      <Text variant="eyebrow">{eyebrow}</Text>
      <AnimatePresence initial={false}>
        {items.map((item, index) => {
          const staggerIndex = staggerIndices[index]
          const isNewItem = staggerIndex !== undefined

          return (
            <motion.div
              key={item.text}
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
              <Text color={item.tone === 'critical' ? 'red600' : undefined}>
                {`• ${item.text}`}
              </Text>
            </motion.div>
          )
        })}
      </AnimatePresence>
      {children}
    </Box>
  )
}

export default VerdictTimelineBody
