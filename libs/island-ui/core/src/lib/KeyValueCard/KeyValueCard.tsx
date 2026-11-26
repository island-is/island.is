import React, { ReactNode } from 'react'
import cn from 'classnames'

import { Box } from '../Box/Box'
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader'
import { Text } from '../Text/Text'
import * as styles from './KeyValueCard.css'

export interface KeyValueCardItem {
  label: string
  value: ReactNode
}

export interface KeyValueCardProps {
  columns: KeyValueCardItem[][]
  img?: string
  loading?: boolean
}

export const KeyValueCard = ({
  columns,
  img,
  loading = false,
}: KeyValueCardProps) => (
  <Box
    display="flex"
    alignItems="center"
    columnGap={3}
    background="white"
    border="standard"
    borderColor="blue200"
    borderRadius="large"
    padding={3}
  >
    <div className={styles.columns}>
      {columns.map((items, columnIndex) => (
        <dl
          key={columnIndex}
          className={cn(styles.column, {
            [styles.columnDivided]: columnIndex > 0,
          })}
        >
          {items.map((item, itemIndex) => (
            <div
              key={`${item.label}-${itemIndex}`}
              className={cn(styles.item, {
                [styles.itemDivided]: columnIndex > 0,
              })}
            >
              <dt>
                <Text as="span" variant="medium">
                  {item.label}
                </Text>
              </dt>
              <Box component="dd" marginTop={1} className={styles.value}>
                {loading ? (
                  <SkeletonLoader width={120} height={28} />
                ) : (
                  <Text as="span" variant="h5">
                    {item.value}
                  </Text>
                )}
              </Box>
            </div>
          ))}
        </dl>
      ))}
    </div>
    {img && <img src={img} alt="" className={styles.image} />}
  </Box>
)
