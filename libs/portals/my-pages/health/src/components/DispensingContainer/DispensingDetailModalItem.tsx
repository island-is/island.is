import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import React, { ReactNode } from 'react'
import { messages } from '../../lib/messages'
import * as styles from './DispensingContainer.css'

interface DispensingDetailModalItemProps {
  label: string
  value?: string | null
  blue?: boolean
  tag?: ReactNode
}

const DispensingDetailModalItem: React.FC<DispensingDetailModalItemProps> = ({
  label,
  value,
  blue,
  tag,
}) => {
  const { formatMessage } = useLocale()

  return (
    <GridContainer
      className={cn({
        [styles.blue]: blue,
        [styles.innerGrid]: !tag,
        [styles.tagPadding]: tag,
      })}
    >
      <GridRow>
        <GridColumn span={'5/12'}>
          <Box
            className={styles.titleCol}
            height="full"
            display="flex"
            alignItems="center"
          >
            <Text fontWeight="semiBold" variant="small" as="span">
              {label}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn span={tag ? '5/12' : '7/12'} className={styles.data}>
          <Box display="flex" alignItems="center" height="full">
            <Text variant="small" truncate>
              {value ?? formatMessage(messages.notRegistered)}
            </Text>
          </Box>
        </GridColumn>
        {tag && <GridColumn span={'2/12'}>{tag}</GridColumn>}
      </GridRow>
    </GridContainer>
  )
}

export default DispensingDetailModalItem
