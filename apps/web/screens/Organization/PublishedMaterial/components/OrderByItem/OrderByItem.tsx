import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './OrderByItem.css'

interface OrderByItemProps {
  isSelected?: boolean
  onClick?: () => void
}

export const OrderByItem: React.FC<OrderByItemProps> = ({
  isSelected,
  onClick,
  children,
}) => {
  return (
    <Box
      className={styles.container}
      padding={1}
      cursor="pointer"
      textAlign="center"
      onClick={onClick}
    >
      <Text
        variant="small"
        color={isSelected ? 'blue400' : 'dark400'}
        fontWeight={isSelected ? 'semiBold' : 'regular'}
      >
        {children}
      </Text>
    </Box>
  )
}

export default OrderByItem
