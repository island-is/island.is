import React from 'react'
import { Text } from '@island.is/island-ui/core'
import TaxBreakdownItem from './TaxBreakdownItem'

import * as styles from './TaxBreakdown.css'

const TaxBreakdown = () => {
  return (
    <table className={styles.tableContainer}>
      <tr>
        <th>
          <Text variant="small" fontWeight="semiBold">
            Fyrirtæki
          </Text>
        </th>
        <th>
          <Text variant="small" fontWeight="semiBold">
            Heildarlaun
          </Text>
        </th>
        <th>
          <Text variant="small" fontWeight="semiBold">
            Persónuafsláttur
          </Text>
        </th>
        <th>
          <Text variant="small" fontWeight="semiBold">
            Staðgreiðsla
          </Text>
        </th>
      </tr>
      <TaxBreakdownItem
        headline="Janúar 2022"
        items={['230203 krþ', 1000, 300, '23929']}
      />
    </table>
  )
}

export default TaxBreakdown
