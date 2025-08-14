import { ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'

import { SkeletonLoader } from '@island.is/island-ui/core'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'

export const StatisticsLayout = <T,>({
  stats,
  loading,
  children,
}: {
  stats?: T
  loading: boolean
  children: ReactNode
}) => {
  return (
    <>
      <SectionHeading title="Samantekt" />
      {loading && !stats ? (
        <SkeletonLoader height={800} />
      ) : (
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      )}
    </>
  )
}
