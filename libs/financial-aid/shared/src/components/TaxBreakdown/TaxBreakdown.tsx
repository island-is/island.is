import React from 'react'
import { Text } from '@island.is/island-ui/core'
import TaxBreakdownItem from './TaxBreakdownItem'

import * as styles from './TaxBreakdown.css'

const TaxBreakdown = () => {
  const tableHeaders = [
    'Fyrirtæki',
    'Heildarlaun',
    'Persónuafsláttur',
    'Staðgreiðsla',
  ]

  return (
    <table className={styles.tableContainer}>
      <tr>
        {tableHeaders.map((headers) => {
          return (
            <th>
              <Text variant="small" fontWeight="semiBold">
                {headers}
              </Text>
            </th>
          )
        })}
      </tr>
      <TaxBreakdownItem
        headline="Janúar 2022"
        items={['230203 krþ', 1000, 300, '23929']}
      />
    </table>
  )
}

export default TaxBreakdown
