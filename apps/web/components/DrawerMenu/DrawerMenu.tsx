import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import cn from 'classnames'
import ToggleButton from './components/ToggleButton/ToggleButton'
import { Text, Box, Link } from '@island.is/island-ui/core'
import * as styles from './DrawerMenu.treat'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'
import { theme } from '@island.is/island-ui/theme'

type CategoryItem = {
  title: string
  url: string
  as?: string
}

type Category = {
  title: string
  items: CategoryItem[]
}

interface DrawerMenuProps {
  categories: Category[]
}

interface DrawerMenuCategoryProps extends Category {
  main?: boolean
  onClick?: () => void
  isOpen?: boolean
}

const MainCategoryHeader = ({ title, onClick, isOpen }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="spaceBetween"
    className={cn(styles.top, styles.mainHeader)}
    paddingBottom={3}
    marginBottom={3}
    width="full"
    background="purple100"
    padding={3}
    onClick={onClick}
  >
    <Text variant="h4">{title}</Text>
    <ToggleButton isActive={isOpen} onClick={onClick} />
  </Box>
)

const DrawerMenuCategory: React.FC<DrawerMenuCategoryProps> = ({
  main,
  title,
  items,
  onClick,
  isOpen,
}) => (
  <Box
    className={styles.category}
    boxShadow="subtle"
    background="purple100"
    borderRadius="large"
  >
    {main ? (
      <MainCategoryHeader title={title} onClick={onClick} isOpen={isOpen} />
    ) : (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        className={styles.top}
        paddingBottom={3}
        marginBottom={3}
        padding={3}
      >
        <Text variant="h4">{title}</Text>
      </Box>
    )}
    <Box component="ul" padding={3} position="relative">
      {items.map((item, id) => {
        let linkProps = {
          href: item.url,
        }

        if (!item.url.startsWith('#')) {
          linkProps = {
            ...(item.url && { href: item.url }),
            ...(item.as && { as: item.as }),
          }
        }

        return (
          <Box key={id} component="li">
            <Link {...linkProps}>
              <Text as="p" paddingBottom={2}>
                {item.title}
              </Text>
            </Link>
          </Box>
        )
      })}
    </Box>
  </Box>
)

const DRAWER_HEADING_HEIGHT = 77
const DRAWER_EXPANDED_PADDING_TOP = STICKY_NAV_HEIGHT + theme.spacing[4]

const DrawerMenu: React.FC<DrawerMenuProps> = ({ categories }) => {
  const [mounted, setMounted] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const [contentTop, setContentTop] = useState(0)
  const contentRef = useRef(null)
  const containerRef = useRef(null)
  const [isOpen, setOpen] = useState(false)
  const [useScroll, setUseScroll] = useState<boolean>(false)
  const [initialOverflow, setInitialOverflow] = useState(null)
  const { height: viewportHeight } = useWindowSize()
  const [mainCategory, ...rest] = categories
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
  }

  // Close on route change
  useEffect(() => {
    router.events.on('routeChangeStart', handleClose)
    router.events.on('hashChangeStart', handleClose)

    return () => {
      router.events.off('routeChangeStart', handleClose)
      router.events.off('hashChangeStart', handleClose)
    }
  }, [router.events])

  useEffect(() => {
    if (typeof window === 'object') {
      setInitialOverflow(document.body.style.overflow)
      setMounted(true)
    }
  }, [])

  const onResize = useCallback(() => {
    if (contentRef?.current) {
      setContentHeight(contentRef.current.offsetHeight)
    }
  }, [contentRef])

  useEffect(() => {
    onResize()

    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize, containerRef])

  const handleClickContainer = useCallback(
    (e) => {
      if (containerRef?.current && e.target === containerRef.current) {
        handleClose()
      }
    },
    [containerRef],
  )

  useEffect(() => {
    onResize()

    document.body.style.overflow = isOpen && useScroll ? 'hidden' : 'visible'

    const el = containerRef?.current

    el && isOpen
      ? el.addEventListener('click', handleClickContainer, {
          passive: true,
        })
      : el && el.removeEventListener('click', handleClickContainer)

    return () => {
      el && el.removeEventListener('click', handleClickContainer)
      document.body.style.overflow = initialOverflow
    }
  }, [isOpen, useScroll, handleClickContainer, initialOverflow, onResize])

  useEffect(() => {
    const tallContent = contentHeight > viewportHeight

    setContentTop(
      tallContent
        ? -viewportHeight + DRAWER_HEADING_HEIGHT + DRAWER_EXPANDED_PADDING_TOP
        : -contentHeight + DRAWER_HEADING_HEIGHT,
    )

    setUseScroll(contentHeight > viewportHeight)
  }, [contentHeight, isOpen, viewportHeight])

  return (
    mounted && (
      <div
        ref={containerRef}
        className={cn(styles.container, {
          [styles.containerOpen]: isOpen,
          [styles.containerScroll]: isOpen && useScroll,
        })}
        style={{
          height: isOpen ? 'auto' : DRAWER_HEADING_HEIGHT,
        }}
      >
        <div
          ref={contentRef}
          className={styles.content}
          style={{
            height: 'auto',
            top: isOpen ? viewportHeight - DRAWER_HEADING_HEIGHT : 0,
            transform: `translateY(${isOpen ? `${contentTop}px` : 0})`,
          }}
        >
          <DrawerMenuCategory
            main
            title={mainCategory.title}
            items={mainCategory.items}
            onClick={() => setOpen(!isOpen)}
            isOpen={isOpen}
          />
          {rest.map((category) => (
            <DrawerMenuCategory
              key={category.title}
              title={category.title}
              items={category.items}
            />
          ))}
        </div>
      </div>
    )
  )
}

export default DrawerMenu
