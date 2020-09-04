import React, { useState } from 'react'
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
}

const DrawerMenuCategory: React.FC<DrawerMenuCategoryProps> = ({
  main,
  title,
  items,
}) => (
  <Box
    className={styles.category}
    borderRadius="large"
    marginX={3}
    background="purple100"
    padding={3}
    boxShadow="subtle"
    width="full"
  >
    <Box
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      className={styles.top}
      paddingBottom={3}
      marginBottom={3}
    >
      <Typography variant="h4">{title}</Typography>
      {main && (
        <Box paddingLeft={1}>
          <ToggleButton isActive onClick={() => null} />
        </Box>
      )}
    </Box>
    <Box component="ul">
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

const DrawerMenu: React.FC<DrawerMenuProps> = ({ categories }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mainCategory, ...rest] = categories
  return (
    <div className={styles.root}>
      <DrawerMenuCategory
        main
        title={mainCategory.title}
        items={mainCategory.items}
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
