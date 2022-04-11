import React from 'react'
import { Box, GridColumn, Text } from '@island.is/island-ui/core'
import * as styles from './DetailTable.css'

interface PropTypes {
  label: string
  value: string | null
}

const Column = ({ label, value }: PropTypes) => {
  return (
    <>
      <GridColumn
        span={['6/12', '6/12', '3/12', '3/12', '3/12']}
        className={styles.item}
      >
        <Box
          paddingBottom={2}
          paddingTop={2}
          paddingLeft={3}
          display="flex"
          alignItems="center"
        >
          <p className={styles.pTitle}>{label}</p>
        </Box>
      </GridColumn>
      <GridColumn
        span={['6/12', '6/12', '3/12', '3/12', '3/12']}
        className={styles.item}
      >
        <Box paddingBottom={2} paddingTop={2} paddingLeft={3}>
          <p className={styles.pItem}>{value}</p>
        </Box>
      </GridColumn>
    </>
  )
}

export default Column
