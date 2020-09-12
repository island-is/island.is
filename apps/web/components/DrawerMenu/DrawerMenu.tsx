import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import cn from 'classnames'
import ToggleButton from './components/ToggleButton/ToggleButton'
import { Typography, Box, Link } from '@island.is/island-ui/core'
import * as styles from './DrawerMenu.treat'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'
import { theme } from '@island.is/island-ui/theme'

export type CategoryItem = {
  title: string
  url: string
  as?: string
}

type Category = {
  title: string
  items: CategoryItem[]
}

export interface DrawerMenuProps {
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
    component="button"
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
    <Typography variant="h4">{title}</Typography>
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
        <Typography variant="h4">{title}</Typography>
      </Box>
    )}
    <Box component="ul" padding={3} position="relative">
      {items.map((item) => (
        <Box component="li">
          <Typography as="p" paddingBottom={2}>
            <Link href={item.url} as={item.as}>
              {item.title}
            </Link>
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
)

const DRAWER_HEADING_HEIGHT = 77
const DRAWER_EXPANDED_PADDING_TOP = STICKY_NAV_HEIGHT + theme.spacing[4]

const DrawerMenu: React.FC<DrawerMenuProps> = ({ categories }) => {
  const [isOpen, setOpen] = useState(false)
  const { height: viewportHeight } = useWindowSize()
  const [mainCategory, ...rest] = categories
  const offsetY = viewportHeight - DRAWER_HEADING_HEIGHT
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

  if (viewportHeight === Infinity) {
    // We're on the server, try again later.
    return null
  }

  return (
    <div
      className={styles.root}
      style={{
        top: offsetY,
        transform: `translateY(${
          isOpen ? `${-offsetY + DRAWER_EXPANDED_PADDING_TOP}px` : 0
        })`,
        minHeight: viewportHeight - DRAWER_EXPANDED_PADDING_TOP,
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
  )
}

export default DrawerMenu
