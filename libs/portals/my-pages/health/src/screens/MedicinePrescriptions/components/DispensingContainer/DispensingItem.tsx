import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import React, { ReactNode } from 'react'
import cn from 'classnames'
import * as styles from './DispensingContainer.css'

export interface DispensingItemProps {
  number: string
  date: string
  pharmacy: string
  quantity: string
  icon: ReactNode
  bold?: boolean
  backgroundColor?: 'blue' | 'white'
}

const DispensingItem: React.FC<DispensingItemProps> = ({
  number,
  date,
  pharmacy,
  quantity,
  icon,
  bold,
  backgroundColor = 'blue',
}) => {
  return (
    <GridRow className={cn(styles.backgroundColor[backgroundColor])}>
      {number && (
        <GridColumn span={'1/9'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {number}
          </Text>
        </GridColumn>
      )}

      <GridColumn span={'1/9'}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flexStart"
          height="full"
        >
          {icon}
        </Box>
      </GridColumn>

      {date && (
        <GridColumn span={'2/9'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {date}
          </Text>
        </GridColumn>
      )}
      {pharmacy && (
        <GridColumn span={'3/9'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {pharmacy}
          </Text>
        </GridColumn>
      )}
      {quantity && (
        <GridColumn span={'2/9'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {quantity}
          </Text>
        </GridColumn>
      )}
    </GridRow>
  )
}

export default DispensingItem
