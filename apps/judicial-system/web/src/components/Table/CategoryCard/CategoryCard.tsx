import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Box, FocusableBox, LoadingDots, Text } from '@island.is/island-ui/core'

import * as styles from './CategoryCard.css'

interface CategoryCardProps {
  heading: string | React.ReactNode
  tags?: React.ReactNode
  onClick: () => void
  children: React.ReactNode
  isLoading?: boolean
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  heading,
  onClick,
  tags,
  children,
  isLoading = false,
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
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.loadingContainer}
          >
            <LoadingDots single />
          </motion.div>
        )}
      </AnimatePresence>
    </FocusableBox>
  )
}

export default CategoryCard
