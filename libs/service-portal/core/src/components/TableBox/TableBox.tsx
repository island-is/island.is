import React, { FC } from 'react'
import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import * as styles from './TableBox.css'

interface Props {
  data: Array<{ title: string; value?: string | number }>
}

export const TableBox: FC<React.PropsWithChildren<Props>> = ({ data }) => {
  return (
    <Box background="blue100">
      <GridContainer className={styles.grid}>
        <GridRow>
          {data.map((item, i) => (
            <GridColumn key={i} className={styles.col} span="4/12">
              <Box className={styles.innerCol}>
                <Text fontWeight="semiBold" variant="medium" as="span">
                  {item.title}
                </Text>
              </Box>
              <Box className={styles.innerCol}>
                <Text variant="medium" as="span">
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

export default TableBox
