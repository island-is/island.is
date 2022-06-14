import React from 'react'
import { Box, GridColumn } from '@island.is/island-ui/core'
import * as styles from './DetailTable.css'
import { MessageDescriptor } from '@formatjs/intl'
import { useLocale, useNamespaces } from '@island.is/localization'

interface PropTypes {
  label: MessageDescriptor
  value: string | null | number | undefined
}

const Column = ({ label, value }: PropTypes) => {
  const { formatMessage } = useLocale()
  useNamespaces('sp.vehicles')

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
          <p className={styles.pTitle}>{formatMessage(label)}</p>
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
