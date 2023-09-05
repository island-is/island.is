import React from 'react'

import { Box, FocusableBox, Text } from '@island.is/island-ui/core'

import * as styles from './CategoryCard.css'

interface CategoryCardProps {
  heading: string | React.ReactNode
  tags?: React.ReactNode
  onClick: () => void
  children: React.ReactNode
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  heading,
  onClick,
  tags,
  children,
}) => {
  return (
    <FocusableBox
      className={styles.card}
      height="full"
      width="full"
      component="button"
      onClick={onClick}
    >
      <Box>
        <Text variant="h3" as="h3" color={'blue400'} marginBottom={1}>
          {heading}
        </Text>
        {children}
        <Box marginTop={3}>{tags}</Box>
      </Box>
    </FocusableBox>
  )
}

export default CategoryCard
