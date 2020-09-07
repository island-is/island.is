import React, { useState } from 'react'
import { useMeasure, useWindowSize } from 'react-use'
import cn from 'classnames'
import * as styles from './DrawerMenu.treat'
import Typography from '../Typography/Typography'
import ToggleButton from './components/ToggleButton/ToggleButton'
import { Box } from '../Box'
import { Link } from '../Link'

type CategoryItem = {
  title: string
  url: string
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
  isExpanded?: boolean
}

const MainCategoryHeader = ({ title, onClick, isExpanded }) => {
  const [ref, { width }] = useMeasure()

  return (
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
      ref={ref}
      padding={3}
      onClick={onClick}
    >
      <Typography variant="h4">{title}</Typography>
      <ToggleButton isActive={isExpanded} onClick={onClick} />
    </Box>
  )
}

const DrawerMenuCategory: React.FC<DrawerMenuCategoryProps> = ({
  main,
  title,
  items,
  onClick,
  isExpanded,
}) => {
  return (
    <Box
      className={styles.category}
      boxShadow="subtle"
      background="purple100"
      borderRadius="large"
    >
      {main ? (
        <MainCategoryHeader
          title={title}
          onClick={onClick}
          isExpanded={isExpanded}
        />
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
              <Link href={item.url}>{item.title}</Link>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const DRAWER_HEADING_HEIGHT = 77
const DRAWER_EXPANDED_PADDING_TOP = 44

const DrawerMenu: React.FC<DrawerMenuProps> = ({ categories }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mainCategory, ...rest] = categories
  const [ref, { height }] = useMeasure()
  const { height: viewportHeight } = useWindowSize()
  const offsetY = viewportHeight - DRAWER_HEADING_HEIGHT
  console.log(isExpanded)
  return (
    <div
      className={styles.root}
      ref={ref}
      style={{
        top: offsetY,
        transform: `translateY(${
          isExpanded ? `${-offsetY + DRAWER_EXPANDED_PADDING_TOP}px` : 0
        })`,
        minHeight: viewportHeight - DRAWER_EXPANDED_PADDING_TOP,
        position: isExpanded ? 'absolute' : 'fixed',
      }}
    >
      <DrawerMenuCategory
        main
        title={mainCategory.title}
        items={mainCategory.items}
        onClick={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
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
