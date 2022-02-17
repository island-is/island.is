import React from 'react'
import { Text } from '@island.is/island-ui/core'
import TaxBreakdownItem from './TaxBreakdownItem'

import * as styles from './TaxBreakdown.css'

export const taxBreakDownHeaders = [
  'Fyrirtæki',
  'Heildarlaun',
  'Persónuafsláttur',
  'Staðgreiðsla',
]

const TaxBreakdown = () => {
  return (
    <table className={styles.tableContainer}>
      <tr className={styles.tableHeaders}>
        {taxBreakDownHeaders.map((headers) => {
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
      <TaxBreakdownItem
        headline="Desember 2021"
        items={['230203 krþ', 1000, 300, '23929']}
      />
    </table>
  )
}

export default TaxBreakdown
