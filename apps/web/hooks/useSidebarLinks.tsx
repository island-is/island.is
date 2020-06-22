import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react'
import cn from 'classnames'
import { Box, Typography, BoxProps } from '@island.is/island-ui/core'
import { useScrollPosition } from './useScrollPosition'

import * as styles from './useSidebarLinks.treat'

export const useSidebarLinks = (selector?: string) => {
  const [offsets, setOffsets] = useState([])
  const [elements, setElements] = useState([])
  const [canUpdate, setCanUpdate] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [clickedIndex, setClickedIndex] = useState(null)
  const timer = useRef(null)

  const getElements = useCallback(
    () =>
      Array.from(
        document.querySelectorAll(
          selector || '[data-sidebar-link]',
        ) as NodeListOf<HTMLElement>,
      ),
    [selector],
  )

  useScrollPosition(
    ({ currPos }) => {
      if (!canUpdate) {
        return false
      }

      const yPos = Math.abs(currPos.y)

      const idx = offsets.reduce((num, currentOffset, index) => {
        const nextOffset = offsets[index + 1]

        if (yPos >= currentOffset && yPos <= nextOffset) {
          num = index
        }

        return num
      }, 0)

      setClickedIndex(null)
      setActiveIndex(idx)
    },
    [offsets, canUpdate],
    null,
    false,
    150,
  )

  const updateOffsets = useCallback(() => {
    setElements(getElements())
    setOffsets(getElements().map((x) => x.offsetTop))
  }, [getElements])

  useLayoutEffect(() => {
    updateOffsets()
  }, [updateOffsets])

  useEffect(() => {
    window.addEventListener('resize', updateOffsets)
    updateOffsets()
    return () => {
      window.removeEventListener('resize', updateOffsets)
      clearTimeout(timer.current)
    }
  }, [updateOffsets])

  const goTo = (index) => {
    clearTimeout(timer.current)
    setClickedIndex(index)
    setCanUpdate(false)
    timer.current = setTimeout(() => setCanUpdate(true), 1000)
    window.scrollTo(0, offsets[index])
  }

  const currentIndex = clickedIndex || activeIndex

  return {
    links: elements.map((link, index) => {
      return (boxProps: BoxProps) => (
        <Box
          component="button"
          type="button"
          textAlign="left"
          outline="none"
          onClick={() => goTo(index)}
          {...boxProps}
        >
          <Typography variant="p" as="span">
            <span
              className={cn({
                [styles.active]: index === currentIndex,
              })}
            >
              {link.textContent}
            </span>
          </Typography>
        </Box>
      )
    }),
  }
}

export default useSidebarLinks
