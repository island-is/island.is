import React, { FC } from 'react'
import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import * as styles from './FinanceTransactionsDetail.css'

interface Props {
  data: Array<{ title: string; value?: string | number }>
}

const FinanceTransactionsDetail: FC<Props> = ({ data }) => {
  return (
    <Box padding={2} background="blue100">
      <GridContainer className={styles.grid}>
        <GridRow>
          {data.map((item, i) => (
            <GridColumn key={i} className={styles.col} span="4/12">
              <Box className={styles.innerCol}>
                <Text fontWeight="semiBold" variant="small" as="span">
                  {item.title}
                </Text>
              </Box>
              <Box className={styles.innerCol}>
                <Text variant="small" as="span">
                  {item.value}
                </Text>
              </Box>
            </GridColumn>
          ))}
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default FinanceTransactionsDetail
