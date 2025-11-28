import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import React, { ReactNode } from 'react'
import * as styles from './DispensingContainer.css'

export interface DispensingItemProps {
  number: string
  date: string
  pharmacy: string
  quantity: string
  medicine?: string
  strength?: string
  icon: ReactNode
  bold?: boolean
  backgroundColor?: 'blue' | 'white'
  button?: {
    onClick: () => void
    text: string
  }
}

const DispensingItem: React.FC<DispensingItemProps> = ({
  number,
  date,
  pharmacy,
  quantity,
  medicine,
  strength,
  icon,
  bold,
  button,
  backgroundColor = 'blue',
}) => {
  return (
    <GridRow className={cn(styles.backgroundColor[backgroundColor])}>
      {number && (
        <GridColumn span={'1/12'} className={styles.text}>
          <Inline flexWrap="nowrap">
            <Text
              fontWeight={bold ? 'medium' : 'regular'}
              paddingY="p2"
              variant="small"
            >
              {number}
            </Text>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flexStart"
              height="full"
              marginLeft={[0, 0, 1, 2, 2]}
            >
              {icon}
            </Box>
          </Inline>
        </GridColumn>
      )}

      {date && (
        <GridColumn span={'2/12'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {date}
          </Text>
        </GridColumn>
      )}
      {pharmacy && (
        <GridColumn span={'3/12'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {pharmacy}
          </Text>
        </GridColumn>
      )}
      {medicine && (
        <GridColumn span={'2/12'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {medicine}
          </Text>
        </GridColumn>
      )}
      {strength && (
        <GridColumn span={'1/12'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {strength}
          </Text>
        </GridColumn>
      )}
      {quantity && (
        <GridColumn span={'1/12'} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {quantity}
          </Text>
        </GridColumn>
      )}
      {button && (
        <GridColumn span={'2/12'} className={styles.text}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flexEnd"
            height="full"
          >
            <Button
              variant="text"
              size="small"
              onClick={button.onClick}
              icon="arrowForward"
              iconType="outline"
            >
              {button.text}
            </Button>
          </Box>
        </GridColumn>
      )}
    </GridRow>
  )
}

export default DispensingItem
