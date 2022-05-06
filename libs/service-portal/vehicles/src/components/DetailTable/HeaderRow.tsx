import React from 'react'
import {
  Box,
  GridRow,
  GridColumn,
  Divider,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './DetailTable.css'
import { MessageDescriptor } from '@formatjs/intl'
import { useLocale, useNamespaces } from '@island.is/localization'

interface PropTypes {
  children: MessageDescriptor
}

const HeaderRow = ({ children }: PropTypes) => {
  const { formatMessage } = useLocale()
  useNamespaces('sp.vehicles')

  return (
    <GridRow className={styles.row}>
      <GridColumn
        span={['12/12', '12/12', '12/12']}
        paddingBottom="p2"
        paddingTop="p2"
        className={styles.column}
      >
        <Box background="blue100" paddingY="p2" paddingLeft={3}>
          <Text variant="small" fontWeight="semiBold">
            {formatMessage(children)}
          </Text>
        </Box>
        <Divider />
      </GridColumn>
    </GridRow>
  )
}

export default HeaderRow
