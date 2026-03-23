import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import React from 'react'
import * as styles from './DispensingContainer.css'

export interface DispensingItemProps {
  id: string
  date: string
  pharmacy: string
  quantity: string
  medicine?: string
  strength?: string
  bold?: boolean
  backgroundColor?: 'blue' | 'white'
  button?: {
    onClick: () => void
    text: string
  }
}

const DispensingItem: React.FC<DispensingItemProps> = ({
  date,
  pharmacy,
  quantity,
  medicine,
  strength,
  bold,
  button,
  backgroundColor = 'blue',
}) => {
  const hasButton = button != null

  return (
    <GridRow className={cn(styles.backgroundColor[backgroundColor])}>
      {date && (
        <GridColumn span={['6/12', '6/12', '2/12']} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {date}
          </Text>
        </GridColumn>
      )}
      {pharmacy && (
        <GridColumn
          span={['6/12', '6/12', hasButton ? '2/12' : '3/12']}
          className={styles.text}
        >
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2" truncate>
            {pharmacy}
          </Text>
        </GridColumn>
      )}
      {medicine && (
        <GridColumn
          span={['6/12', '6/12', hasButton ? '2/12' : '3/12']}
          className={styles.text}
        >
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2" truncate>
            {medicine}
          </Text>
        </GridColumn>
      )}
      {strength && (
        <GridColumn span={['6/12', '6/12', '2/12']} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {strength}
          </Text>
        </GridColumn>
      )}
      {quantity && (
        <GridColumn span={['6/12', '6/12', '2/12']} className={styles.text}>
          <Text fontWeight={bold ? 'medium' : 'regular'} paddingY="p2">
            {quantity}
          </Text>
        </GridColumn>
      )}
      {hasButton && button.text !== '' && (
        <GridColumn span={['12/12', '12/12', '2/12']} className={styles.text}>
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
