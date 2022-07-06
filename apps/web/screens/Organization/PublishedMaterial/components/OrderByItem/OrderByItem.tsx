import React, { useState } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './OrderByItem.css'

interface OrderByItemProps {
  isSelected?: boolean
  isHighlighted?: boolean
  onClick?: () => void
  hasBorderTop?: boolean
}

export const OrderByItem: React.FC<OrderByItemProps> = ({
  isSelected,
  isHighlighted,
  onClick,
  hasBorderTop,
  children,
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false)
  return (
    <Box
      className={`${styles.container} ${hasBorderTop ? styles.borderTop : ''}`}
      padding={1}
      cursor="pointer"
      textAlign="center"
      onClick={onClick}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
    >
      <Text
        variant="small"
        color={
          isSelected || isMouseOver || isHighlighted ? 'blue400' : 'dark400'
        }
        fontWeight={isSelected ? 'semiBold' : 'regular'}
      >
        {children}
      </Text>
    </Box>
  )
}

export default OrderByItem
