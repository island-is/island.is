import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'

import * as styles from './ScrollIndicator.css'

export interface ScrollIndicatorColors {
  outerColor: string
  activeColor: string
  inactiveColor: string
}

interface ScrollIndicatorProps {
  scrollRef: React.RefObject<HTMLElement | null>
  colors: ScrollIndicatorColors
  ariaLabel?: string
}

export const ScrollIndicator = ({
  scrollRef,
  colors,
  ariaLabel,
}: ScrollIndicatorProps) => {
  const [activePage, setActivePage] = useState(0)
  const [numPages, setNumPages] = useState(0)

  const calculateState = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const { scrollWidth, clientWidth, scrollLeft } = container
    if (scrollWidth <= clientWidth) {
      setNumPages(0)
      return
    }

    const pages = Math.max(2, Math.round(scrollWidth / clientWidth))
    setNumPages(pages)

    const maxScroll = scrollWidth - clientWidth
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0
    const page = Math.round(progress * (pages - 1))
    setActivePage(Math.max(0, Math.min(page, pages - 1)))
  }, [scrollRef])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    calculateState()

    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        calculateState()
        rafId = null
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', calculateState)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateState)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [scrollRef, calculateState])

  const handleDotClick = (index: number) => {
    const container = scrollRef.current
    if (!container) return

    const { scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth
    const targetScroll = numPages > 1 ? (index / (numPages - 1)) * maxScroll : 0

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    })
  }

  if (numPages <= 1) return null

  return (
    <div
      className={styles.wrapper}
      role="navigation"
      aria-label={ariaLabel ?? 'Page navigation'}
    >
      <div
        className={styles.pill}
        style={{ backgroundColor: colors.outerColor }}
      >
        {[...Array(numPages)].map((_, index) => (
          <button
            key={index}
            className={cn(styles.dot, {
              [styles.dotActive]: activePage === index,
            })}
            style={{
              backgroundColor:
                activePage === index
                  ? colors.activeColor
                  : colors.inactiveColor,
            }}
            onClick={() => handleDotClick(index)}
            aria-label={`Page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
