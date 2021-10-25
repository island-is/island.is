/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback, useRef, FC } from 'react'
import cn from 'classnames'
import {
  Box,
  Text,
  Stack,
  Divider,
  FocusableBox,
} from '@island.is/island-ui/core'
import { useScrollPosition } from '../../hooks/useScrollPosition'

import * as styles from './Sidebar.css'

interface UseHeadingLinksProps {
  selector?: string
  disabled?: boolean
}

export const getHeadingLinkElements = (
  selector?: UseHeadingLinksProps['selector'],
) =>
  typeof document === 'object'
    ? Array.from(
        document.querySelectorAll(
          selector || '[data-sidebar-link]',
        ) as NodeListOf<HTMLElement>,
      )
    : []

const useHeadingLinks = ({
  selector,
  disabled = false,
}: UseHeadingLinksProps) => {
  const [offsets, setOffsets] = useState([])
  const [elements, setElements] = useState([])
  const [canUpdate, setCanUpdate] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  const timer = useRef(null)

  const getElements = useCallback(() => getHeadingLinkElements(selector), [
    selector,
  ])

  useScrollPosition(
    ({ currPos }) => {
      if (disabled || !canUpdate) {
        return false
      }

      const yPos = Math.abs(currPos.y)
      const idx = offsets.reduce((acc, offset, index) => {
        return yPos >= offset ? index : acc
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
    setOffsets(
      getElements().map((x) => {
        return x.getBoundingClientRect().top + window.scrollY
      }),
    )
  }, [getElements])

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

  const currentIndex = (clickedIndex !== null ? clickedIndex : activeIndex) || 0

  return {
    links: elements.map((link, index) => {
      const selected = index === currentIndex

      return {
        title: link.textContent,
        onClick: () => goTo(index),
        selected,
      }
    }),
    currentIndex,
  }
}

type SidebarLinkItems = {
  title: string
  href: string
  as?: string
  active?: boolean
}

interface SidebarProps {
  title: string
  items?: SidebarLinkItems[]
  headingLinks?: boolean
}

export const Sidebar: FC<SidebarProps> = ({
  title,
  items,
  headingLinks,
  children,
}) => {
  const itemsRef = useRef<Array<HTMLElement | null>>([])
  const parentRef = useRef<HTMLElement | null>(null)
  const [top, setTop] = useState<number>(0)
  const { links, currentIndex } = useHeadingLinks({
    disabled: !headingLinks,
  })

  const updateBulletPlacement = useCallback(() => {
    itemsRef.current = itemsRef.current.slice(0, links.length)

    const parentTop = parentRef.current.getBoundingClientRect().top
    const selectedItem = itemsRef.current[currentIndex]

    if (selectedItem) {
      setTop(selectedItem.getBoundingClientRect().top - parentTop)
    }
  }, [links, currentIndex])

  useEffect(() => {
    updateBulletPlacement()
  }, [updateBulletPlacement])

  const sortedItems = Array.isArray(items)
    ? items.sort((a, b) => a.title.localeCompare(b.title, 'is'))
    : []

  return (
    <Box
      ref={parentRef}
      position="relative"
      background="purple100"
      borderRadius="large"
      padding={4}
    >
      <Stack space={[1, 1, 2]}>
        <Text variant="h4" as="h2">
          {title}
        </Text>
        {headingLinks && links.length ? (
          <Stack space={[1, 1, 2]}>
            <Divider weight="alternate" />
            {links.map(({ title, selected, onClick }, index) => {
              return (
                <FocusableBox
                  key={index}
                  ref={(el) => (itemsRef.current[index] = el)}
                  component="button"
                  type="button"
                  textAlign="left"
                  onClick={onClick}
                >
                  <Text as="span">
                    <span
                      className={cn({
                        [styles.active]: selected,
                      })}
                    >
                      {title}
                    </span>
                  </Text>
                </FocusableBox>
              )
            })}
          </Stack>
        ) : null}
        {items && <Divider weight="alternate" />}
        {sortedItems.map(({ title, active, href, as }, index) => (
          <FocusableBox key={index} href={href} as={as}>
            <Text as="span">{active ? <strong>{title}</strong> : title}</Text>
          </FocusableBox>
        ))}
        {children && <Divider weight="alternate" />}
        {children && children}
      </Stack>
    </Box>
  )
}

export default Sidebar
